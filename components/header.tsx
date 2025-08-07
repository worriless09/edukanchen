'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
              alt="Kanchen Academy Logo"
              width={144}
              height={56}
              className="w-36 h-14"
              priority
            />
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#courses" className="hover:text-gray-900 font-normal text-sm font-sans text-black">Courses</a>
            <a href="#features" className="hover:text-gray-900 font-normal text-sm font-sans text-black">Features</a>
            <a href="#faculty" className="hover:text-gray-900 font-normal text-sm font-sans text-black">Faculty</a>
            <a href="#contact" className="hover:text-gray-900 font-normal text-sm text-black font-sans">Contact</a>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50 text-sm font-sans font-medium text-black">
              Login
            </Button>
            <Button className="hover:bg-primary-500 text-white text-sm font-medium font-sans bg-primary-700">
              Start Free Trial
            </Button>
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#courses" className="text-gray-700 hover:text-gray-900 font-normal">Courses</a>
              <a href="#features" className="text-gray-700 hover:text-gray-900 font-normal">Features</a>
              <a href="#faculty" className="text-gray-700 hover:text-gray-900 font-normal">Faculty</a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 font-normal">Contact</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="border-gray-300 text-gray-700">
                  Login
                </Button>
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
