'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Play,
  CreditCard,
  FileText,
  PenTool,
  StickyNote,
  Clock,
  Newspaper,
  Brain,
  TrendingUp,
  Route,
  Settings,
  DollarSign,
  ChevronRight,
  GraduationCap,
  Target,
  BarChart3,
  Calendar,
  Award,
  Zap,
  X,
} from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ExtendedUser {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  avatar_url?: string;
  subscription_tier?: 'free' | 'premium';
}

interface NavigationProps {
  user: ExtendedUser | null;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: BadgeProps['variant'];
  children?: NavItem[];
  isPremium?: boolean;
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Learning',
    icon: GraduationCap,
    children: [
      { title: 'Courses', href: '/courses', icon: BookOpen },
      {
        title: 'Videos',
        href: '/videos',
        icon: Play,
        badge: 'New',
        badgeVariant: 'secondary',
      },
      { title: 'Study Materials', href: '/study-materials', icon: FileText },
      {
        title: 'Learning Paths',
        href: '/learning-paths',
        icon: Route,
        isPremium: true,
      },
    ],
  },
  {
    title: 'Practice',
    icon: Target,
    children: [
      { title: 'Flashcards', href: '/flashcards', icon: CreditCard },
      {
        title: 'Mock Tests',
        href: '/mock-tests',
        icon: PenTool,
        badge: '5',
        badgeVariant: 'default',
      },
      { title: 'Quiz', href: '/quiz', icon: Brain },
      { title: 'Previous Year Questions', href: '/pyqs', icon: Clock },
    ],
  },
  {
    title: 'Resources',
    icon: FileText,
    children: [
      { title: 'Notes', href: '/notes', icon: StickyNote },
      { title: 'Current Affairs', href: '/current-affairs', icon: Newspaper },
      {
        title: 'Daily Updates',
        href: '/daily-updates',
        icon: Calendar,
        badge: 'Today',
        badgeVariant: 'outline',
      },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    children: [
      {
        title: 'AI Question Analyzer',
        href: '/ai-analyzer',
        icon: Zap,
        isPremium: true,
      },
      { title: 'Learning Progress', href: '/progress', icon: TrendingUp },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { title: 'Settings', href: '/settings', icon: Settings },
  {
    title: 'Pricing',
    href: '/pricing',
    icon: DollarSign,
    badge: 'Upgrade',
    badgeVariant: 'premium',
  },
];

// Animation variants
const sidebarVariants: Variants = {
  open: {
    width: 280,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    width: 80,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const itemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const childrenVariants: Variants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  user: ExtendedUser | null;
  onNavigate?: () => void;
  depth?: number;
}

function NavItemComponent({
  item,
  isActive,
  isCollapsed,
  user,
  onNavigate,
  depth = 0,
}: NavItemComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const hasActiveChild = item.children?.some((child) => pathname === child.href);

  useEffect(() => {
    if (hasActiveChild && !isCollapsed) setIsExpanded(true);
  }, [hasActiveChild, isCollapsed]);

  const handleClick = () => {
    if (item.children) {
      if (!isCollapsed) setIsExpanded(!isExpanded);
    } else if (item.href) {
      // Add debugging
      console.log('Navigating to:', item.href);
      console.log('User can access:', !item.isPremium || user?.subscription_tier === 'premium');
      
      router.push(item.href);
      // Add small delay before closing mobile sidebar
      setTimeout(() => {
        onNavigate?.();
      }, 100);
    }
  };

  const isUserPremium = user?.subscription_tier === 'premium';
  const canAccess = !item.isPremium || isUserPremium;
  const IconComponent = item.icon;

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={item.isPremium && !isUserPremium}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
          'hover:bg-gray-100 active:scale-[0.98]',
          depth > 0 ? 'ml-4 text-sm' : '',
          isActive && depth === 0
            ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-500'
            : '',
          isActive && depth > 0 ? 'bg-blue-50 text-blue-600' : '',
          !isActive ? 'text-gray-600 hover:text-gray-900' : '',
          !canAccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          isCollapsed && depth === 0 ? 'justify-center px-2' : ''
        )}
        whileHover={{ scale: canAccess ? 1.02 : 1 }}
        whileTap={{ scale: canAccess ? 0.98 : 1 }}
      >
        <div
          className={cn(
            'flex items-center gap-3 flex-1 min-w-0',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <div
            className={cn(
              'flex-shrink-0 relative',
              isActive ? 'text-blue-600' : 'text-gray-500'
            )}
          >
            <IconComponent className="h-5 w-5" />
            {item.isPremium && !isUserPremium && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-white" />
            )}
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex items-center justify-between flex-1 min-w-0"
              >
                <span
                  className={cn(
                    'font-medium truncate',
                    depth > 0 ? 'text-sm' : '',
                    !canAccess ? 'opacity-75' : ''
                  )}
                >
                  {item.title}
                  {item.isPremium && !isUserPremium && (
                    <span className="ml-2 text-xs text-amber-600 font-normal">
                      (Premium)
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || 'default'}
                      className="text-xs px-1.5 py-0.5"
                    >
                      {item.badge}
                    </Badge>
                  )}

                  {item.children && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Children */}
      <AnimatePresence>
        {item.children && isExpanded && !isCollapsed && (
          <motion.div
            variants={childrenVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {item.children.map((child, index) => (
                <NavItemComponent
                  key={child.href || index}
                  item={child}
                  isActive={pathname === child.href}
                  isCollapsed={false}
                  user={user}
                  onNavigate={onNavigate}
                  depth={depth + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navigation({ user, onClose, className }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = () => onClose?.();

  // Debug user state
  useEffect(() => {
    console.log('Navigation - User:', user);
    console.log('Navigation - User subscription:', user?.subscription_tier);
  }, [user]);

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'closed' : 'open'}
      className={cn(
        'flex flex-col bg-white border-r border-gray-200 shadow-sm h-full',
        'md:relative md:translate-x-0',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex items-center gap-3"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
                alt="Kanchen Academy"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h2 className="font-bold text-lg text-gray-900">Kanchen</h2>
                <p className="text-xs text-gray-500">Academy</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {onClose ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 hover:bg-gray-100"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        )}
      </div>

      {/* User Profile */}
      <AnimatePresence>
        {!isCollapsed && user && (
          <motion.div
            variants={itemVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="p-4 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {user.full_name?.split(' ').map((n) => n[0]).join('') ||
                    user.name?.split(' ').map((n) => n[0]).join('') ||
                    user.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {user.full_name || user.name || 'User'}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <Badge
                    variant={
                      user.subscription_tier === 'premium'
                        ? 'premium'
                        : 'outline'
                    }
                    className="text-xs px-1.5 py-0.5"
                  >
                    {user.subscription_tier || 'free'}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-2">
          {navigationItems.map((item, index) => (
            <NavItemComponent
              key={item.href || index}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              user={user}
              onNavigate={handleNavigation}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 p-4">
        <nav className="space-y-2">
          {bottomNavItems.map((item, index) => (
            <NavItemComponent
              key={item.href || index}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              user={user}
              onNavigate={handleNavigation}
            />
          ))}
        </nav>
      </div>

      {/* Upgrade Banner */}
      <AnimatePresence>
        {!isCollapsed && user?.subscription_tier !== 'premium' && (
          <motion.div
            variants={itemVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="p-4 border-t border-gray-100"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <span className="font-semibold text-sm">Go Premium</span>
              </div>
              <p className="text-xs opacity-90 mb-3">
                Unlock all features and get unlimited access
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full text-xs"
                onClick={() => {
                  router.push('/pricing');
                  handleNavigation();
                }}
              >
                Upgrade Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}