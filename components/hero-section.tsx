'use client'

import { Button } from '@/components/ui/button'
import { Play, Star, Users, Award } from 'lucide-react'
import { useState, useEffect } from 'react'

const ctaMessages = [
  "Start 7-Day Free Trial",
  "Join 1000+ Successful Students!",
  "Begin Your UPSC Journey Today!",
  "Transform Your Career Now!",
  "Join Top Rankers Community!"
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
    <section className="relative bg-gray-50 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-normal text-gray-900 leading-tight">
              Master UPSC with <span className="font-medium text-primary-600">AI-Powered</span> Learning
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-light">
              Join thousands of successful aspirants who cracked competitive exams with our comprehensive courses, 
              AI flashcards, and personalized study plans.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 font-sans">
            <Button size="lg" className="hover:bg-primary-500 text-white px-8 py-4 text-base font-medium rounded-lg shadow-sm bg-primary-500 font-sans">
              {ctaMessages[currentCta]}
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-100 px-8 py-4 text-base font-medium rounded-lg text-primary-700 font-sans">
              <Play className="h-4 w-4 mr-2" />
              {""} 
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12">
            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">50,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">95% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Trusted by top rankers from:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
                <span>IAS 2023 Rank 1</span>
                <span className="text-gray-400">•</span>
                <span>SSC CGL Toppers</span>
                <span className="text-gray-400">•</span>
                <span>State PCS Winners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
