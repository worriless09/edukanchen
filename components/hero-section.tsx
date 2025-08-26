"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useState, useEffect } from "react"

const ctaMessages = [
  "Get Free Demo Class - No Cost!",
  "Join 1000+ Successful Students!",
  "Begin Your UPSC Journey Today!",
  "Transform Your Career Now!",
  "Join Top Rankers Community!",
]

export function HeroSection() {
  const [currentCta, setCurrentCta] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCta((prev) => (prev + 1) % ctaMessages.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 lg:py-32 bg-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 items-center gap-6">
          {/* Left side - Main content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Main Heading */}
            <div className="space-y-6 flex-row items-center">
              <h1 className="text-4xl font-normal text-gray-900 leading-tight lg:text-6xl flex-row items-start tracking-tighter h-fit w-fit">
                Transform Your Dreams into <span className="font-medium text-primary-600">Civil Service Success</span>
              </h1>
              <p className="text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light text-gray-800">
                Join India's most innovative coaching institute combining traditional teaching excellence with
                AI-powered learning tools. Specialized preparation for UPSC, SSC, and State PCS examinations.
              </p>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-gray-600">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-600">1000+</div>
                <div className="text-sm text-gray-600">Successful Students</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-600">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 font-sans">
              <Button
                size="lg"
                className="hover:bg-primary-500 text-white px-8 py-4 text-base font-medium rounded-lg shadow-sm bg-primary-500 font-sans transition-all duration-300"
              >
                {ctaMessages[currentCta]}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="border-gray-300 hover:bg-gray-100 px-8 py-4 text-base font-medium rounded-lg text-primary-700 font-sans bg-transparent cursor-pointer transition-all duration-300"
              >
                <Play className="h-4 w-4 mr-2" />
                Explore Courses
              </Button>
            </div>
          </div>

          {/* Right side - AI-Powered Learning Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm hover:shadow-xl transition-shadow duration-300 px-9 w-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">🤖</div>
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Learning</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Personalized study paths with spaced repetition</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
