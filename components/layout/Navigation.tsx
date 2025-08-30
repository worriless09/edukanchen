// components/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, BookOpen, FileText, ClipboardList, HelpCircle, Home, TrendingUp, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';

const studyItems = [
  {
    href: '/ai-analyzer',
    icon: Brain,
    title: 'AI Analyzer',
    description: 'Smart content analysis and insights',
    emoji: '🧠'
  },
  {
    href: '/flashcards',
    icon: BookOpen,
    title: 'Study Cards',
    description: 'Interactive learning cards and practice',
    emoji: '🗂️'
  },
  {
    href: '/notes',
    icon: FileText,
    title: 'Notes',
    description: 'Comprehensive study materials',
    emoji: '📝'
  },
  {
    href: '/mock-tests',
    icon: ClipboardList,
    title: 'Mock Tests',
    description: 'Full-length practice examinations',
    emoji: '📋'
  },
  {
    href: '/pyq',
    icon: HelpCircle,
    title: 'Previous Year Questions',
    description: 'Solve past exam questions',
    emoji: '❓'
  }
];

import { User as AuthUser } from '@/types/auth';

interface ExtendedUser extends AuthUser {
  name?: string;
  avatar_url?: string;
}

interface NavigationProps {
  user?: ExtendedUser | null;
  isOpen?: boolean;
  onClose?: () => void;
}

function NavigationContent({ user, isOpen, onClose }: NavigationProps) {
  const pathname = usePathname();
  const { state } = useSidebar();

  // Main navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/courses', label: 'Learning Paths', icon: TrendingUp },
    { href: '/dashboard', label: 'Progress', icon: Calendar },
    { href: '/current-affairs', label: 'Daily Updates', icon: BookOpen },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header with user info */}
      <SidebarHeader>
        {user && (
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.avatar_url} alt={user.name || user.email || 'User'} />
              <AvatarFallback className="text-xs">
                {user.name ? getInitials(user.name) : (user.email?.[0]?.toUpperCase() || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user.name || 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.subscription_tier || 'Free'} Plan
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={state === "collapsed" ? item.label : undefined}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Study Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Study Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studyItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link href={item.href}>
                      <span className="text-base">{item.emoji}</span>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{item.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with stats */}
      {user && (
        <SidebarFooter>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="grid gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Study Streak</span>
                <span className="font-medium text-blue-600">7 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tests Done</span>
                <span className="font-medium text-green-600">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hours</span>
                <span className="font-medium text-purple-600">142h</span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

export const Navigation = ({ user, isOpen, onClose }: NavigationProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <NavigationContent user={user} isOpen={isOpen} onClose={onClose} />
    </SidebarProvider>
  );
};