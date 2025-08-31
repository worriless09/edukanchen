// app/learning-paths/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, Users, Clock, Target, CheckCircle, 
  Play, Star, TrendingUp, Award, ArrowRight 
} from "lucide-react"
import Link from "next/link"

const learningPaths = [
  {
    id: "upsc-cse",
    title: "UPSC Civil Services",
    description: "Complete preparation for IAS, IPS, IFS and other central services",
    duration: "18-24 months",
    difficulty: "Advanced",
    students: 2500,
    rating: 4.8,
    progress: 0,
    subjects: ["History", "Geography", "Polity", "Economics", "Environment", "Current Affairs"],
    features: ["Live Classes", "Mock Tests", "Personal Mentor", "Study Materials"],
    price: "₹49,999",
    color: "blue"
  },
  {
    id: "ssc-cgl",
    title: "SSC Combined Graduate Level",
    description: "Comprehensive preparation for SSC CGL and related exams",
    duration: "12-18 months",
    difficulty: "Intermediate",
    students: 1800,
    rating: 4.7,
    progress: 0,
    subjects: ["Quantitative Aptitude", "Reasoning", "English", "General Awareness"],
    features: ["Live Classes", "Mock Tests", "Speed Tests", "Previous Year Papers"],
    price: "₹29,999",
    color: "green"
  },
  {
    id: "state-pcs",
    title: "State PCS Preparation",
    description: "Tailored preparation for various state public service commissions",
    duration: "15-20 months",
    difficulty: "Advanced",
    students: 1200,
    rating: 4.6,
    progress: 0,
    subjects: ["State History", "Geography", "Polity", "Current Affairs", "Optional Subject"],
    features: ["State-specific Content", "Mock Tests", "Essay Writing", "Interview Prep"],
    price: "₹39,999",
    color: "purple"
  },
  {
    id: "banking-exams",
    title: "Banking & Insurance",
    description: "Complete preparation for IBPS, SBI, RBI and insurance exams",
    duration: "8-12 months",
    difficulty: "Intermediate",
    students: 2100,
    rating: 4.5,
    progress: 0,
    subjects: ["Quantitative Aptitude", "Reasoning", "English", "Banking Awareness"],
    features: ["Sectional Tests", "Mock Interviews", "Current Affairs", "Speed Drills"],
    price: "₹24,999",
    color: "orange"
  }
]

export default function LearningPathsPage() {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced": return "bg-red-100 text-red-700"
      case "Intermediate": return "bg-yellow-100 text-yellow-700"
      case "Beginner": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Structured learning journeys designed by experts to help you achieve your career goals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">5000+</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">850+</div>
              <div className="text-sm text-gray-600">Success Stories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-gray-600">Exam Categories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Paths */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {learningPaths.map((path) => (
            <Card key={path.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getColorClasses(path.color)}`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {path.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-4">{path.description}</p>
                  </div>
                  <Badge className={getBadgeColor(path.difficulty)}>
                    {path.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {path.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {path.rating}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm text-gray-500">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                </div>

                {/* Subjects */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                  <div className="space-y-2">
                    {path.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{path.price}</span>
                    <span className="text-sm text-gray-500 ml-1">/year</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Link href={`/courses?path=${path.id}`}>
                      <Button size="sm" className={`bg-gradient-to-r ${getColorClasses(path.color)} hover:opacity-90`}>
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Path to Choose?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Take our free career assessment to find the perfect learning path for your goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Take Assessment
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Counseling
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}