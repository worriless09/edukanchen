'use client'

import { Button } from '@/components/ui/button'
import { Play, Heart, Users, Compass } from 'lucide-react'
import { useState, useEffect } from 'react'

// Updated with supportive, journey-focused messaging
const ctaMessages = [
  "Start Your Learning Journey",
  "Join Our Growing Community",
  "Begin With Confidence Today",
  "Discover Your Potential",
  "Take the First Step"
]

export function HeroSection() {
  const [currentCta, setCurrentCta] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCta((prev) => (prev + 1) % ctaMessages.length)
    }, 3000) // Slower, more gentle pace

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-misty-lighter py-20 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M20,80 Q40,60 60,80 T100,80" stroke="currentColor" fill="none" strokeWidth="0.5"/>
          <path d="M0,85 Q20,65 40,85 T80,85" stroke="currentColor" fill="none" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 bg-misty-light text-misty px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🌱</span>
            <span>Your Trusted Learning Companion</span>
          </div>

          {/* Main Heading - More supportive language */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-forest leading-tight">
              Your Trusted Companion for{' '}
              <span className="text-misty font-bold">UPSC & Competitive Exam</span>{' '}
              Success
            </h1>
            <p className="text-xl text-forest-medium leading-relaxed max-w-2xl mx-auto font-normal">
              Join a supportive community of learners on their journey to success. 
              With gentle AI guidance, smart spaced learning, and personalized support, 
              every step feels achievable.
            </p>
          </div>

          {/* CTA Buttons - Softer approach */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-misty hover:bg-misty text-white px-8 py-4 text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all animate-gentle-bounce"
            >
              {ctaMessages[currentCta]}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-misty text-misty hover:bg-misty-light px-8 py-4 text-base font-medium rounded-xl transition-all"
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Our Story
            </Button>
          </div>

          {/* Trust Indicators - More encouraging */}
          <div className="pt-12">
            <div className="flex flex-wrap justify-center gap-8 text-forest-medium">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-misty" />
                <span className="text-sm font-medium">20,000+ Learning Companions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-sage" />
                <span className="text-sm font-medium">Supportive Community</span>
              </div>
              <div className="flex items-center space-x-2">
                <Compass className="h-5 w-5 text-sand" />
                <span className="text-sm font-medium">Guided Learning Paths</span>
              </div>
            </div>

            {/* Success Stories - More humble approach */}
            <div className="mt-8">
              <p className="text-sm text-forest-medium mb-3">
                Celebrating success stories from our learning community:
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="bg-misty-light px-4 py-2 rounded-lg">
                  <span className="text-misty font-medium">Priya S.</span>
                  <span className="text-forest-medium ml-2">UPSC CSE 2024, AIR 47</span>
                </div>
                <div className="bg-sage-light px-4 py-2 rounded-lg">
                  <span className="text-sage font-medium">Rahul G.</span>
                  <span className="text-forest-medium ml-2">SSC CGL 2024, AIR 12</span>
                </div>
                <div className="bg-sand-light px-4 py-2 rounded-lg">
                  <span className="text-sand font-medium">Anjali V.</span>
                  <span className="text-forest-medium ml-2">IBPS PO 2024, Selected</span>
                </div>
              </div>
            </div>

            {/* Gentle encouragement */}
            <div className="mt-8 p-6 bg-misty-light rounded-2xl max-w-2xl mx-auto">
              <p className="text-forest italic font-medium">
                "Every expert was once a beginner. Every professional was once an amateur. 
                Every achiever was once a dreamer. Let us guide you on your journey."
              </p>
              <p className="text-misty text-sm mt-2">— Kanchen Academy Learning Philosophy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
