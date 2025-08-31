"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"

export function HeaderOptimized({ user, onSignOut, onMenuToggle }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Matches your screenshot */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">Kanchen Academy</div>
              <div className="text-xs text-gray-500">Your Learning Companion</div>
            </div>
          </Link>

          {/* Navigation Tabs - Matches your screenshot exactly */}
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
                </div>
              )}
            </div>
          </nav>

          {/* Login/Book Trial - Matches your screenshot */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 font-medium px-6">Book Trial</Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
