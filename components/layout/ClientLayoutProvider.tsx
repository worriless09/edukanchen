'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import  ErrorBoundary  from '@/components/ErrorBoundary'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription?: {
    plan: 'free' | 'premium' | 'pro'
    expiresAt: string
    isActive: boolean
  }
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
  }
}

interface ClientLayoutContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
}

const ClientLayoutContext = createContext<ClientLayoutContextType | undefined>(undefined)

export const useClientLayout = () => {
  const context = useContext(ClientLayoutContext)
  if (context === undefined) {
    throw new Error('useClientLayout must be used within a ClientLayoutProvider')
  }
  return context
}

interface ClientLayoutProviderProps {
  children: ReactNode
}

export function ClientLayoutProvider({ children }: ClientLayoutProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Initialize user session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored auth token
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Validate token and get user data
          const userData = await validateToken(token)
          if (userData) {
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            // Invalid token, clear it
            localStorage.removeItem('auth_token')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Mock token validation - replace with actual API call
  const validateToken = async (token: string): Promise<User | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock user data - replace with actual API response
    if (token === 'valid_token') {
      return {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        avatar: '/avatars/user.jpg',
        subscription: {
          plan: 'premium',
          expiresAt: '2025-12-31T23:59:59Z',
          isActive: true
        },
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en'
        }
      }
    }
    return null
  }

  // Route protection logic
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ['/', '/login', '/register', '/pricing']
      const authRoutes = ['/login', '/register']
      
      // Redirect authenticated users away from auth pages
      if (isAuthenticated && authRoutes.includes(pathname)) {
        router.push('/dashboard')
        return
      }

      // Redirect unauthenticated users to login for protected routes
      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        router.push('/login')
        return
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      
      // Mock login API call - replace with actual implementation
      const response = await mockLoginAPI(email, password)
      
      if (response.success && response.user && response.token) {
        localStorage.setItem('auth_token', response.token)
        setUser(response.user)
        setIsAuthenticated(true)
        showToast('Login successful!', 'success')
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast(error instanceof Error ? error.message : 'Login failed', 'error')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setIsAuthenticated(false)
    showToast('Logged out successfully', 'info')
    router.push('/')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // This will be handled by the toast context or direct toast calls
    console.log(`Toast [${type}]: ${message}`)
    // You can integrate with your toast system here
  }

  // Mock login API - replace with actual implementation
  const mockLoginAPI = async (email: string, password: string): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    if (email === 'user@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        email: email,
        name: 'John Doe',
        avatar: '/avatars/user.jpg',
        subscription: {
          plan: 'premium' as const,
          expiresAt: '2025-12-31T23:59:59Z',
          isActive: true
        },
        preferences: {
          theme: 'system' as const,
          notifications: true,
          language: 'en'
        }
      }
      
      return {
        success: true,
        token: 'valid_token',
        user: user
      }
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    }
  }

  const contextValue: ClientLayoutContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    showToast
  }

  // Show loading spinner during initial authentication check
  if (isLoading && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ClientLayoutContext.Provider value={contextValue}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster />
        </ErrorBoundary>
      </ThemeProvider>
    </ClientLayoutContext.Provider>
  )
}

// Hook for accessing user data
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useClientLayout()
  return { user, isAuthenticated, isLoading }
}

// Hook for authentication actions
export const useAuthActions = () => {
  const { login, logout, updateUser } = useClientLayout()
  return { login, logout, updateUser }
}

// Custom hook for subscription status
export const useSubscription = () => {
  const { user } = useAuth()
  
  const subscription = user?.subscription
  const isPremium = subscription?.plan === 'premium' || subscription?.plan === 'pro'
  const isActive = subscription?.isActive ?? false
  const expiresAt = subscription?.expiresAt ? new Date(subscription.expiresAt) : null
  const isExpired = expiresAt ? new Date() > expiresAt : false
  
  return {
    subscription,
    isPremium,
    isActive: isActive && !isExpired,
    expiresAt,
    isExpired,
    plan: subscription?.plan ?? 'free'
  }
}

// Route guard component
interface RouteGuardProps {
  children: ReactNode
  requiredAuth?: boolean
  requiredSubscription?: 'premium' | 'pro'
  fallback?: ReactNode
}

export function RouteGuard({ 
  children, 
  requiredAuth = false, 
  requiredSubscription,
  fallback 
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { isPremium, plan } = useSubscription()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requiredAuth && !isAuthenticated) {
        router.push('/login')
        return
      }
      
      if (requiredSubscription) {
        if (!isPremium) {
          router.push('/pricing')
          return
        }
        
        if (requiredSubscription === 'pro' && plan !== 'pro') {
          router.push('/pricing')
          return
        }
      }
    }
  }, [isAuthenticated, isLoading, isPremium, plan, requiredAuth, requiredSubscription, router])

  if (isLoading) {
    return fallback || <LoadingSpinner size="lg" />
  }

  if (requiredAuth && !isAuthenticated) {
    return fallback || null
  }

  if (requiredSubscription && !isPremium) {
    return fallback || null
  }

  if (requiredSubscription === 'pro' && plan !== 'pro') {
    return fallback || null
  }

  return <>{children}</>
}

// Notification provider hook
export const useNotifications = () => {
  const { showToast } = useClientLayout()
  
  const notify = {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info')
  }
  
  return notify
}