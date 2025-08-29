"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, CheckCircle } from "lucide-react"

const studyMaterials = [
  {
    title: "Previous Year Questions (PYQs)",
    description: "Comprehensive collection of last 20 years questions with detailed solutions",
    icon: "📄",
    features: ["Topic-wise categorization", "Difficulty analysis", "Solution videos"],
    freeContent: "Last 5 years questions",
    premiumContent: "Complete 20 years database + trend analysis",
    color: "teal",
    gradientFrom: "from-teal-400",
    gradientTo: "to-green-500",
  },
  {
    title: "Mock Tests & Practice",
    description: "AI-powered mock tests that adapt to your performance level",
    icon: "📋",
    features: ["Adaptive difficulty", "Performance analytics", "All India ranking"],
    freeContent: "5 mock tests per month",
    premiumContent: "Unlimited tests + detailed analysis",
    color: "orange",
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
  },
  {
    title: "Study Notes & Materials",
    description: "Expertly curated notes covering entire syllabus with regular updates",
    icon: "📚",
    features: ["Visual learning aids", "Quick revision notes", "Mind maps"],
    freeContent: "Basic notes for 3 subjects",
    premiumContent: "Complete syllabus + advanced materials",
    color: "purple",
    gradientFrom: "from-purple-400",
    gradientTo: "to-pink-500",
  },
  {
    title: "Current Affairs",
    description: "Daily current affairs with monthly compilations and analysis",
    icon: "📰",
    features: ["Daily updates", "Monthly magazines", "Editorial analysis"],
    freeContent: "Weekly current affairs",
    premiumContent: "Daily updates + editorial analysis",
    color: "blue",
    gradientFrom: "from-blue-400",
    gradientTo: "to-indigo-500",
  },
  {
    title: "Smart Revision Tools",
    description: "AI-powered flashcards and spaced repetition for effective memorization",
    icon: "🧠",
    features: ["Spaced repetition algorithm", "Custom flashcards", "Progress tracking"],
    freeContent: "Basic flashcards",
    premiumContent: "AI-powered spaced repetition + analytics",
    color: "pink",
    gradientFrom: "from-pink-400",
    gradientTo: "to-rose-500",
  },
  {
    title: "Interactive Quizzes",
    description: "Gamified learning with topic-wise quizzes and instant feedback",
    icon: "🎯",
    features: ["Instant feedback", "Leaderboards", "Achievement badges"],
    freeContent: "10 quizzes per week",
    premiumContent: "Unlimited quizzes + detailed explanations",
    color: "yellow",
    gradientFrom: "from-yellow-400",
    gradientTo: "to-orange-500",
  },
]

export function StudyMaterialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-4 my-0 py-2 bg-sky-50 border-sky-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-0 mb-2 py-1">Complete Study Ecosystem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for UPSC preparation - from PYQs to AI-powered revision tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyMaterials.map((material, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-center rounded-4xl bg-blue-100"
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br text-center border-none ml-28 ${material.gradientFrom} ${material.gradientTo} flex mb-4 shadow-lg items-center justify-center`}
                >
                  <span className="text-2xl filter drop-shadow-sm">{material.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{material.title}</CardTitle>
                <p className="text-gray-600 text-sm">{material.description}</p>
              </CardHeader>

              <CardContent className="space-y-6 text-left">
                {/* Features */}
                <div className="space-y-2 text-right">
                  {material.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-8">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Free vs Premium Content */}
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-left">
                    <div className="flex items-center gap-2 mb-1 ml-24">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        FREE
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 text-center">{material.freeContent}</p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1 ml-20">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        PREMIUM
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 text-center">{material.premiumContent}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent font-semibold">
                    Try Free
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 max-w-4xl mx-auto">
            <CardContent className="p-8 py-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Unlock Premium Access</h3>
              </div>
              <p className="text-blue-100 mb-6 text-lg">
                Get unlimited access to all study materials, AI-powered tools, and premium features
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  View Pricing Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
