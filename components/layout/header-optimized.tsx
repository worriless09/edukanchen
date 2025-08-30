// components/layout/header-optimized.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, User, LogOut, Settings, BookOpen } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from '@/components/ui/sidebar';

import { User as AuthUser } from '@/types/auth';

interface ExtendedUser extends AuthUser {
  name?: string;
  avatar_url?: string;
}

interface HeaderOptimizedProps {
  user?: ExtendedUser | null;
  onSignOut?: () => void;
  onMenuToggle?: () => void;
}

export function HeaderOptimized({ user, onSignOut, onMenuToggle }: HeaderOptimizedProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      {/* Sidebar trigger for mobile */}
      <SidebarTrigger className="lg:hidden -ml-1" />

      {/* Logo - only show on mobile when sidebar is closed */}
      <Link href="/" className="flex items-center space-x-2 lg:hidden">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">KA</span>
        </div>
        <span className="font-bold text-xl text-gray-900 hidden sm:block">
          Kanchen Academy
        </span>
      </Link>

      {/* Desktop: Logo is in sidebar, so we can add breadcrumbs or page title here */}
      <div className="hidden lg:flex items-center space-x-2">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side - User menu or Auth buttons */}
      <div className="flex items-center space-x-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} alt={user.full_name || user.email || 'User'} />
                  <AvatarFallback>
                    {user.full_name ? getInitials(user.full_name) : (user.email?.[0]?.toUpperCase() || 'U')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.full_name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {user.subscription_tier || 'Free'} Plan
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu - Only show if not using sidebar */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 border-t border-gray-200 bg-white shadow-lg z-40">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/mock-tests"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Mock Tests
            </Link>
            <Link
              href="/flashcards"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Flashcards
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            
            {!user && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}