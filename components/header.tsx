"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 h-fit">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
              alt="Kanchen Academy Logo"
              className="w-36 h-14"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-base font-mono font-semibold">
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-gray-900 text-sm text-black cursor-pointer font-sans font-semibold"
            >
              Courses
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-gray-900 text-sm font-sans text-black cursor-pointer font-semibold"
            >
              Features
            </a>
            <a
              href="#faculty"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("faculty")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-gray-900 text-sm font-sans text-black cursor-pointer font-semibold"
            >
              Faculty
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="hover:text-gray-900 text-sm text-black font-sans cursor-pointer font-semibold"
            >
              Contact
            </a>
            <Button
              variant="outline"
              className="hover:bg-gray-50 text-sm font-sans text-black bg-transparent font-semibold border-gray-300"
            >
              Login
            </Button>
            <Button className="hover:bg-primary-500 text-white text-sm font-sans bg-primary-500 font-semibold">
              Book Trial Class
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-gray-900">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a
                href="#courses"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 hover:text-gray-900 font-normal cursor-pointer"
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
                className="text-gray-700 hover:text-gray-900 font-normal cursor-pointer"
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
                className="text-gray-700 hover:text-gray-900 font-normal cursor-pointer"
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
                className="text-gray-700 hover:text-gray-900 font-normal cursor-pointer"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="border-gray-300 text-gray-700 bg-transparent">
                  Login
                </Button>
                <Button className="bg-primary-400 hover:bg-primary-500 text-white">Book Trial Class</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
