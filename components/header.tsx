"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
              alt="Kanchen Academy Logo"
              className="w-36 h-14"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer font-semibold text-black"
            >
              Courses
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer text-black font-semibold"
            >
              Features
            </a>
            <a
              href="#faculty"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("faculty")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer text-black font-semibold"
            >
              Faculty
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer text-black font-semibold"
            >
              Contact
            </a>
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 bg-transparent text-black font-semibold"
            >
              Login
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg font-semibold">
              Book Trial Class
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-gray-900">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <a
                href="#courses"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                Courses
              </a>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                Features
              </a>
              <a
                href="#faculty"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("faculty")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                Faculty
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="border-gray-300 text-gray-700 bg-transparent">
                  Login
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Book Trial Class</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
