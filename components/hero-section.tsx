//# Updated Hero Section 
"use client"

import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Users, Trophy, BookOpen, Star } from "lucide-react"
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
  { icon: Users, value: "1000+", label: "Students" },
  { icon: Trophy, value: "150+", label: "Selections" },
  { icon: BookOpen, value: "50+", label: "Courses" },
  { icon: Star, value: "4.9", label: "Rating" },
]

export function HeroSection() {
  const [currentCta, setCurrentCta] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCta((prev) => (prev + 1) % ctaMessages.length)
    }, 3000) // Changed to 3 seconds for better readability

    // Proper cleanup to prevent memory leaks
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background decoration - REMOVED YELLOW BLOB */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        {/* Yellow blob removed as requested */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 items-center gap-12">
          {/* Left side - Main content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your Dreams into{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Civil Service Success
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join India's most innovative coaching institute combining traditional teaching excellence with
                AI-powered learning tools. Specialized preparation for UPSC, SSC, and State PCS examinations.
              </p>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover-lift">
                  <CardContent className="p-4 text-center">
                    <achievement.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">{achievement.value}</div>
                    <div className="text-sm text-gray-600">{achievement.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg hover-lift">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent hover-lift"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Dynamic CTA message */}
              <div className="text-center lg:text-left">
                <p className="text-lg font-medium text-blue-600 transition-all duration-300">
                  {ctaMessages[currentCta]}
                </p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>AI-Powered Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Expert Faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual content */}
          <div className="relative">
            <div className="relative z-10">
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 hover-lift">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
                      <p className="text-gray-600">Join thousands of successful aspirants</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg hover-lift">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-semibold text-gray-900">50+ Courses</div>
                        <div className="text-sm text-gray-600">Comprehensive Study</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg hover-lift">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <div className="font-semibold text-gray-900">Expert Faculty</div>
                        <div className="text-sm text-gray-600">Experienced Teachers</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg hover-lift">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <div className="font-semibold text-gray-900">Top Results</div>
                        <div className="text-sm text-gray-600">Proven Success</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg hover-lift">
                        <Star className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <div className="font-semibold text-gray-900">4.9 Rating</div>
                        <div className="text-sm text-gray-600">Student Reviews</div>
                      </div>
                    </div>

                    <Link href="/dashboard" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 hover-lift">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Background decoration for the card */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
