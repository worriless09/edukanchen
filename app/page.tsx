"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Users, Trophy, BookOpen, Star, ChevronDown, Menu, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const ctaMessages = [
  "Get Free Demo Class - No Cost!",
  "Join 1000+ Successful Students!",
  "Begin Your UPSC Journey Today!",
  "Transform Your Career Now!",
  "Join Top Rankers Community!",
]

const achievements = [
  { icon: Users, value: "1000+", label: "Students", color: "blue" },
  { icon: Trophy, value: "150+", label: "Selections", color: "green" },
  { icon: BookOpen, value: "50+", label: "Courses", color: "purple" },
  { icon: Star, value: "4.9", label: "Rating", color: "yellow" },
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false)
  const [currentCta, setCurrentCta] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentCta((prev) => (prev + 1) % ctaMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-700 border-blue-100",
      green: "bg-green-50 text-green-700 border-green-100", 
      purple: "bg-purple-50 text-purple-700 border-purple-100",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-100"
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* CLEAN PROFESSIONAL HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6">
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

            {/* PROFESSIONAL TAB NAVIGATION */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
                <span>🏠</span>
                <span>Home</span>
              </Link>
              <Link href="/learning-paths" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                <span>🎯</span>
                <span>Learning Paths</span>
              </Link>
              <Link href="/progress" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                <span>📊</span>
                <span>Progress</span>
              </Link>
              <Link href="/daily-updates" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                <span>📅</span>
                <span>Daily Updates</span>
              </Link>
              
              {/* Study Tools Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
                >
                  <span>📚</span>
                  <span>Study</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {studyDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setStudyDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-20">
                      <div className="px-4 pb-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Study Tools</h3>
                      </div>
                      <div className="py-2">
                        <Link href="/ai-analyzer" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setStudyDropdownOpen(false)}>
                          <span className="text-xl">🧠</span>
                          <div>
                            <div className="font-medium text-gray-900">AI Analyzer</div>
                            <div className="text-sm text-gray-500">Smart content analysis</div>
                          </div>
                        </Link>
                        <Link href="/flashcards" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setStudyDropdownOpen(false)}>
                          <span className="text-xl">🗂️</span>
                          <div>
                            <div className="font-medium text-gray-900">Study Cards</div>
                            <div className="text-sm text-gray-500">Interactive learning</div>
                          </div>
                        </Link>
                        <Link href="/notes" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setStudyDropdownOpen(false)}>
                          <span className="text-xl">📝</span>
                          <div>
                            <div className="font-medium text-gray-900">Notes</div>
                            <div className="text-sm text-gray-500">Study materials</div>
                          </div>
                        </Link>
                        <Link href="/mock-tests" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setStudyDropdownOpen(false)}>
                          <span className="text-xl">📋</span>
                          <div>
                            <div className="font-medium text-gray-900">Mock Tests</div>
                            <div className="text-sm text-gray-500">Practice exams</div>
                          </div>
                        </Link>
                        <Link href="/pyq" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setStudyDropdownOpen(false)}>
                          <span className="text-xl">❓</span>
                          <div>
                            <div className="font-medium text-gray-900">Previous Year Questions</div>
                            <div className="text-sm text-gray-500">Past questions</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 font-medium px-6">Book Trial</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
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
      
      {/* HERO SECTION - EMBEDDED DIRECTLY */}
      <main className="pt-16">
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-5 items-center gap-12 lg:gap-16">
              
              {/* Left Content */}
              <div className="lg:col-span-3 text-center lg:text-left space-y-8">
                
                {/* Main Heading */}
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                    Transform Your Dreams into{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Civil Service Success
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Join India's most innovative coaching institute combining traditional teaching excellence with{" "}
                    <span className="font-semibold text-blue-800">AI-powered learning tools</span>. 
                    Specialized preparation for UPSC, SSC, and State PCS examinations.
                  </p>
                </div>

                {/* Achievement Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card 
                      key={index} 
                      className={`border shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                        getColorClasses(achievement.color)
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <achievement.icon className="h-8 w-8 mx-auto mb-2 text-current" />
                        <div className="text-2xl font-bold text-gray-900">{achievement.value}</div>
                        <div className="text-sm text-gray-600 font-medium">{achievement.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link href="/register" className="w-full sm:w-auto">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                      >
                        Start Learning Today
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </div>

                  <div className="text-center lg:text-left">
                    <p className="text-lg font-medium text-blue-600 animate-pulse">
                      {ctaMessages[currentCta]}
                    </p>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 text-base">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>AI-Powered Learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Expert Faculty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-2 relative">
                <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
                        <p className="text-gray-600">Join thousands of successful aspirants</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: BookOpen, label: "50+ Courses", desc: "Comprehensive Study", color: "blue" },
                          { icon: Users, label: "Expert Faculty", desc: "Experienced Teachers", color: "green" },
                          { icon: Trophy, label: "Top Results", desc: "Proven Success", color: "purple" },
                          { icon: Star, label: "4.9 Rating", desc: "Student Reviews", color: "yellow" }
                        ].map((feature, index) => (
                          <div 
                            key={index} 
                            className={`text-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                              getColorClasses(feature.color)
                            }`}
                          >
                            <feature.icon className="h-6 w-6 mx-auto mb-2 text-current" />
                            <div className="font-semibold text-gray-900 text-sm">{feature.label}</div>
                            <div className="text-xs text-gray-600 mt-1">{feature.desc}</div>
                          </div>
                        ))}
                      </div>

                      <Link href="/register" className="block">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold shadow-lg">
                          Get Started Free
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          ✨ Free trial • No credit card required
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
