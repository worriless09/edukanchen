// components/hero-section-responsive.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Users, Trophy, BookOpen, Star, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
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

export function HeroSectionResponsive() {
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
    <section className="relative pt-0 h-0-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 md:w-40 md:h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 md:w-44 md:h-44 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
        <div className="grid lg:grid-cols-5 items-center gap-12 lg:gap-16 xl:gap-20">
          
          {/* Left Content - Takes up 3 columns on large screens */}
          <div className={`lg:col-span-3 text-center lg:text-left space-y-6 md:space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-regular text-gray-800 leading-tight tracking-tight">
                Transform Your Dreams into{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Civil Service
                </span>{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Success
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-1.5xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join India's most innovative coaching institute combining traditional teaching excellence with{" "}
                <span className="font-semibold text-cyan-800">AI-powered learning tools</span>. 
                Specialized preparation for UPSC, SSC, and State PCS examinations.
              </p>
            </div>

            {/* Achievement Stats - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index} 
                  className={`border shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    getColorClasses(achievement.color)
                  }`}
                >
                  <CardContent className="p-3 md:p-4 text-center">
                    <achievement.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-current" />
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{achievement.value}</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">{achievement.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Buttons - Responsive */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                  >
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Dynamic CTA Message */}
              <div className="text-center lg:text-left">
                <p className="text-base md:text-lg font-medium text-blue-600 animate-pulse transition-all duration-500">
                  {ctaMessages[currentCta]}
                </p>
              </div>
            </div>

            {/* Trust Indicators - Responsive */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-gray-500 text-sm md:text-base">
              {[
                { color: "green", label: "Live Classes" },
                { color: "blue", label: "AI-Powered Learning" },
                { color: "purple", label: "Expert Faculty" },
                { color: "orange", label: "24/7 Support" }
              ].map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 bg-${indicator.color}-500 rounded-full animate-pulse`}></div>
                  <span className="whitespace-nowrap">{indicator.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Interactive Card - Takes up 2 columns on large screens */}
          <div className={`lg:col-span-2 relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative z-10 max-w-md mx-auto lg:max-w-none">
              <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300">
                <CardContent className="p-5 md:p-6">
                  <div className="space-y-5">
                    
                    {/* Header */}
                    <div className="text-center">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
                      <p className="text-gray-600 text-sm">Join thousands of successful aspirants</p>
                    </div>

                    {/* Feature Grid - Responsive */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: BookOpen, label: "50+ Courses", desc: "Comprehensive Study", color: "blue" },
                        { icon: Users, label: "Expert Faculty", desc: "Experienced Teachers", color: "green" },
                        { icon: Trophy, label: "Top Results", desc: "Proven Success", color: "purple" },
                        { icon: Star, label: "4.9 Rating", desc: "Student Reviews", color: "yellow" }
                      ].map((feature, index) => (
                        <div 
                          key={index} 
                          className={`text-center p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                            getColorClasses(feature.color)
                          }`}
                        >
                          <feature.icon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-current" />
                          <div className="font-semibold text-gray-900 text-sm">{feature.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{feature.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link href="/register" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                        Get Started Free
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>

                    {/* Trust Badge */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        ✨ Free trial • No credit card required • Join 1000+ aspirants
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse animation-delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}