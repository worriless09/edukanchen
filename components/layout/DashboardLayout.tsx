// components/layout/DashboardLayout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  BookOpen, 
  Play, 
  Brain, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  Crown,
  User,
  Bell,
  Search,
  Target,
  BookMarked,
  TrendingUp,
  Calendar,
  Presentation
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Updated navigation based on your actual directory structure
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Videos', href: '/videos', icon: Play },
  { name: 'Flashcards', href: '/flashcards', icon: Brain },
  { name: 'Mock Tests', href: '/mock-tests', icon: Target },
  { name: 'Quiz', href: '/quiz', icon: FileText },
  { name: 'Study Materials', href: '/study-materials', icon: BookMarked },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'PYQs', href: '/pyqs', icon: BarChart3 },
  { name: 'Current Affairs', href: '/current-affairs', icon: TrendingUp },
  { name: 'Daily Updates', href: '/daily-updates', icon: Calendar },
  { name: 'AI Analyzer', href: '/ai-analyzer', icon: Brain },
  { name: 'Progress', href: '/progress', icon: Presentation },
  { name: 'Learning Paths', href: '/learning-paths', icon: Target },
];

// Dashboard-specific routes (inside dashboard route group)
const dashboardRoutes = [
  '/dashboard',
  '/dashboard/courses',
  '/dashboard/flashcards', 
  '/dashboard/mock-tests',
  '/dashboard/student',
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Check if current route is in dashboard route group
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));
  const currentPageName = getCurrentPageName(pathname);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
        <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
              alt="Kanchen Academy Logo"
              className="w-30 h-14 object-scale-down"
            />
            <div>
                            <div className="text-center text-gray-900 hidden sm:block">Your Learning Companion</div>
            </div>
          
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href === '/dashboard' && pathname.startsWith('/dashboard/'));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className={`flex-shrink-0 mr-3 h-5 w-5 ${
                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* User Section */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        {/* Premium/Upgrade Banner */}
        {user?.subscription_tier === 'premium' ? (
          <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg mb-4 border border-yellow-200">
            <Crown className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Premium Member</p>
              <p className="text-xs text-yellow-600">All features unlocked</p>
            </div>
          </div>
        ) : (
          <Link href="/pricing">
            <Button className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="sm">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </Link>
        )}
        
        {/* User Info */}
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <Avatar className="h-10 w-10 ring-2 ring-gray-200">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-3 space-y-1">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-gray-700 hover:bg-white">
              <User className="h-4 w-4 mr-3" />
              Profile
            </Button>
          </Link>
          
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-gray-700 hover:bg-white">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white shadow-sm">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm lg:hidden">
  <div className="flex items-center space-x-3">
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 -ml-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar mobile />
      </SheetContent>
    </Sheet>
    
    <div className="flex items-center space-x-2">
      <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xs">KA</span>
      </div>
      <h1 className="text-lg font-bold text-gray-900">Kanchen</h1>
    </div>
  </div>
  
  <div className="flex items-center space-x-2">
    <Button variant="ghost" size="sm" className="p-2">
      <Bell className="h-4 w-4 text-gray-500" />
    </Button>
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
              {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
        {/* Desktop Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentPageName}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1">
                  <Avatar className="h-9 w-9 ring-2 ring-gray-200">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
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
