'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  Badge,
  ChevronDown,
  Crown,
  Zap
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export interface ExtendedUser {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  avatar_url?: string;
  subscription_tier?: "free" | "premium";
  subscription_status?: "free" | "premium"; // Added for compatibility
}

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: 'free' | 'premium';
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface IntegratedDashboardLayoutProps {
  children: React.ReactNode;
}

// Enhanced User Dropdown Component - Option 2: Enhanced user card
function EnhancedUserDropdown({ 
  user, 
  signOut, 
  isMobile = false 
}: { 
  user: ExtendedUser | null; 
  signOut: () => void;
  isMobile?: boolean;
}) {
  // For now, let's use mock data since profiles table might not exist yet
  // You can uncomment the Supabase code once the database is set up
  
  // const [profile, setProfile] = useState<UserProfile | null>(null);
  // const [loading, setLoading] = useState(true);
  // const supabase = createClientComponentClient();

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (!user) return;
  //     
  //     const { data: profile } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', user.id)
  //       .single();
  //     
  //     setProfile(profile);
  //     setLoading(false);
  //   };

  //   fetchProfile();
  // }, [user, supabase]);

  if (!user) return null;

  // Mock data for now - replace with actual profile data later
  const subscriptionStatus = user.subscription_tier || user.subscription_status || 'premium'; // Mock as premium for demo
  const isPremium = subscriptionStatus === 'premium';
  
  const displayName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // if (loading) {
  //   return (
  //     <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md animate-pulse">
  //       <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-muted rounded-full`} />
  //       {!isMobile && <div className="w-16 h-4 bg-muted rounded" />}
  //     </div>
  //   );
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`${isMobile ? 'p-1 rounded-full h-8 w-8' : 'flex items-center gap-2 px-3 py-2 h-auto rounded-lg'} hover:bg-gray-100 transition-all duration-200`}>
          <Avatar className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200`}>
            <AvatarImage src={user?.avatar_url} alt={displayName} />
            <AvatarFallback className={`bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          
          {!isMobile && (
            <>
              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate max-w-20">
                    {displayName}
                  </span>
                  {isPremium && (
                    <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <Badge 
                  variant={isPremium ? "default" : "secondary"} 
                  className={`text-xs h-4 px-1.5 ${
                    isPremium 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isPremium ? "Premium" : "Free"}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className={`${isMobile ? 'w-56' : 'w-72'} border border-gray-200/50 shadow-xl bg-white backdrop-blur-sm rounded-xl overflow-hidden`}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Enhanced User Card Header */}
          <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
                <AvatarImage src={user?.avatar_url} alt={displayName} />
                <AvatarFallback className="font-semibold bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 truncate text-base">
                    👤 {displayName}
                  </span>
                  {isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
                <span className="text-sm text-gray-600 truncate">
                  {user.email}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg">{isPremium ? '⭐' : '🆓'}</span>
                  <Badge 
                    variant={isPremium ? "default" : "secondary"} 
                    className={`text-xs font-medium ${
                      isPremium 
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm" 
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {isPremium ? "Premium Member" : "Free Account"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Settings</span>
              </Link>
            </DropdownMenuItem>

            {!isPremium && (
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="flex items-center gap-3 px-4 py-2.5 text-orange-600 hover:bg-orange-50 transition-colors duration-150">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Upgrade to Premium</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem 
              onClick={signOut} 
              className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Header component for desktop
function DesktopHeader({ user, signOut }: { user: ExtendedUser | null; signOut: () => void }) {
  const pathname = usePathname();
  const currentPageName = getCurrentPageName(pathname);
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
    >
      {/* Left Section - Page Title */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent truncate max-w-[120px] md:max-w-xs">
            {currentPageName}
          </h1>
        </motion.div>
      </div>
      
      {/* Right Section - Search, Notifications, and User */}
      <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="relative hidden md:block"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-200 text-sm w-40 md:w-64 bg-gray-50/50"
          />
        </motion.div>
        
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-gray-100 relative transition-all duration-200 rounded-full"
          >
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
        </motion.div>
        
        {/* User Button - Always Visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="relative"
        >
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {(user?.full_name || user?.name || user?.email || 'U')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                align="end" 
                className="w-56 border border-gray-200/50 shadow-xl bg-white backdrop-blur-sm rounded-xl"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.full_name || user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={signOut} 
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}

// Mobile header component
function MobileHeader({ user, signOut }: { user: ExtendedUser | null; signOut: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm md:hidden"
    >
      {/* Left Section - Menu and Logo */}
      <div className="flex items-center space-x-3 flex-1">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 -ml-2 hover:bg-gray-100 transition-all duration-200 rounded-full"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-80 bg-white border-r border-gray-200/50"
          >
            <Navigation user={user} onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center space-x-2"
        >
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
            alt="Kanchen Academy Logo"
            className="w-18 h-7 object-contain"
          />
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
            Kanchen Academy
          </h1>
        </motion.div>
      </div>
      
      {/* Right Section - Notifications and User Button */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-gray-100 relative transition-all duration-200 rounded-full"
          >
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
        </motion.div>
        
        {/* User Button - Always Visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="relative"
        >
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                      {(user?.full_name || user?.name || user?.email || 'U')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                align="end" 
                className="w-48 border border-gray-200/50 shadow-lg bg-white/95 backdrop-blur-sm"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.full_name || user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center hover:bg-gray-50 transition-colors duration-150">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center hover:bg-gray-50 transition-colors duration-150">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={signOut} 
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}

// Alternative: Simple User Button Component (if you prefer a simpler version)
function SimpleUserButton({ user, signOut }: { user: ExtendedUser | null; signOut: () => void }) {
  if (!user) return null;

  const displayName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 border border-gray-200/50 shadow-xl bg-white backdrop-blur-sm rounded-xl"
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 px-4 py-2">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={signOut} 
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Main layout component
export default function IntegratedDashboardLayout({ children }: IntegratedDashboardLayoutProps) {
  const { user, signOut } = useAuth();
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Desktop Navigation - Hidden on mobile */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block relative z-10"
      >
        <Navigation user={user} />
      </motion.div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.05)_1px,_transparent_0)] [background-size:20px_20px] pointer-events-none"></div>
        
        {/* Mobile Header - Visible only on mobile */}
        <div className="md:hidden relative z-10">
          <MobileHeader user={user} signOut={signOut} />
        </div>
        
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block relative z-10">
          <DesktopHeader user={user} signOut={signOut} />
        </div>
        
        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-1 overflow-y-auto relative z-10"
        >
          <div className="p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

// Helper function to get current page name
function getCurrentPageName(pathname: string): string {
  const pageNames: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/courses': 'Courses',
    '/videos': 'Videos',
    '/flashcards': 'Flashcards',
    '/mock-tests': 'Mock Tests',
    '/quiz': 'Quiz',
    '/study-materials': 'Study Materials',
    '/notes': 'Notes',
    '/pyqs': 'Previous Year Questions',
    '/current-affairs': 'Current Affairs',
    '/daily-updates': 'Daily Updates',
    '/ai-analyzer': 'AI Question Analyzer',
    '/progress': 'Learning Progress',
    '/learning-paths': 'Learning Paths',
    '/settings': 'Settings',
    '/pricing': 'Pricing',
    '/profile': 'Profile',
    // Dashboard specific routes
    '/dashboard/courses': 'Dashboard - Courses',
    '/dashboard/flashcards': 'Dashboard - Flashcards',
    '/dashboard/mock-tests': 'Dashboard - Mock Tests',
    '/dashboard/student': 'Student Dashboard',
  };
  
  // Check for dynamic routes
  if (pathname.startsWith('/courses/') && pathname !== '/courses') {
    return 'Course Details';
  }
  if (pathname.startsWith('/quiz/attempt/')) {
    return 'Quiz Attempt';
  }
  if (pathname.startsWith('/quiz/results/')) {
    return 'Quiz Results';
  }
  
  return pageNames[pathname] || 'Dashboard';
}