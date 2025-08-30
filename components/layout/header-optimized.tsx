// components/header-optimized.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface HeaderOptimizedProps {
  onMenuToggle?: () => void;
}

export function HeaderOptimized({ onMenuToggle }: HeaderOptimizedProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    // Call the external onMenuToggle if provided (for sidebar toggle)
    if (onMenuToggle) {
      onMenuToggle()
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-20">
          
          {/* Logo - Clickable and responsive */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
              alt="Kanchen Academy Logo"
              width={150}
              height={110}
              className="w-50 h-18 md:w-40 md:h-20 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {[
              { id: 'courses', label: 'Courses' },
              { id: 'features', label: 'Features' },
              { id: 'study-ecosystem', label: 'Study Ecosystem' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm xl:text-base relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 hover:bg-gray-50 bg-transparent text-gray-700 font-medium text-sm lg:text-base"
            >
              Login
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg font-medium text-sm lg:text-base px-4 lg:px-6"
            >
              Book Trial
            </Button>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <span className="text-white text-sm font-medium">👤</span>
              </button>
                     
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-fade-in z-50">
                  <Link 
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Add logout logic
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 z-50"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile/Tablet Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-3">
              {[
                { id: 'courses', label: 'Courses' },
                { id: 'features', label: 'Features' },
                { id: 'study-ecosystem', label: 'Study Ecosystem' },
                { id: 'faculty', label: 'Faculty' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left text-gray-700 hover:text-blue-600 font-medium py-2 px-2 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Button variant="outline" className="border-gray-300 text-gray-700 bg-transparent">
                  Login
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Book Trial Class
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}