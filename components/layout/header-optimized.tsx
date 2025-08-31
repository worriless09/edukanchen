"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface HeaderOptimizedProps {
  user?: any;
  onSignOut?: () => void;
  onMenuToggle?: () => void;
  showAuthButtons?: boolean;
  isDashboard?: boolean;
}

export function HeaderOptimized({ 
  user, 
  onSignOut, 
  onMenuToggle,
  showAuthButtons = true,
  isDashboard = false
}: HeaderOptimizedProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    onMenuToggle?.()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">Kanchen Academy</div>
              <div className="text-xs text-gray-500 hidden sm:block">Your Learning Companion</div>
            </div>
          </Link>

          {/* Navigation - Only show full nav on public pages, simplified on dashboard */}
          {!isDashboard && (
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                🏠 Home
              </Link>
              <Link href="/learning-paths" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                🎯 Learning Paths
              </Link>
              <Link href="/progress" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                📊 Progress
              </Link>
              <Link href="/daily-updates" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                📅 Daily Updates
              </Link>
              
              <div className="relative">
                <button 
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
                >
                  📚 Study
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {studyDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <Link href="/flashcards" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      🗂️ Flashcards
                    </Link>
                    <Link href="/mock-tests" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      📋 Mock Tests
                    </Link>
                    <Link href="/ai-analyzer" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      🧠 AI Analyzer
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          )}

          {/* Right Side - Auth buttons or User menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              // Logged in user menu
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.full_name || user.email?.split('@')[0]}
                </span>
                
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <Link 
                        href="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button 
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onSignOut?.()
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Not logged in - show auth buttons
              showAuthButtons && (
                <div className="hidden lg:flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" className="font-medium">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 font-medium px-6">Book Trial</Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={handleMenuToggle}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(studyDropdownOpen || userDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setStudyDropdownOpen(false)
            setUserDropdownOpen(false)
          }} 
        />
      )}
    </header>
  )
}