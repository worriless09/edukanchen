'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Trophy, Play, Eye, BookOpen } from 'lucide-react'
import { QuizCreator } from '@/components/quiz/QuizCreator'
import { QuizResults } from '@/components/quiz/QuizResults'

interface MockTest {
  id: string
  title: string
  examType: 'UPSC' | 'SSC' | 'Banking' | 'Railway'
  duration: number
  questions: number
  attempts: number
  topScore: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  subjects: string[]
}

export default function MockTestsPage() {
  const [tests, setTests] = useState<MockTest[]>([])
  const [activeTest, setActiveTest] = useState<MockTest | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    // Load mock tests
    const mockTests: MockTest[] = [
      {
        id: '1',
        title: 'UPSC Prelims Mock Test - Current Affairs 2024',
        examType: 'UPSC',
        duration: 120,
        questions: 100,
        attempts: 1245,
        topScore: 89,
        difficulty: 'Medium',
        description: 'Comprehensive test covering current affairs from January 2024 to present',
        subjects: ['Current Affairs', 'Politics', 'Economy', 'Environment']
      },
      {
        id: '2',
        title: 'SSC CGL Quantitative Aptitude',
        examType: 'SSC',
        duration: 60,
        questions: 50,
        attempts: 892,
        topScore: 94,
        difficulty: 'Hard',
        description: 'Advanced mathematical problems and quantitative reasoning',
        subjects: ['Mathematics', 'Algebra', 'Geometry', 'Statistics']
      },
      {
        id: '3',
        title: 'Banking Awareness Mock Test',
        examType: 'Banking',
        duration: 45,
        questions: 40,
        attempts: 567,
        topScore: 87,
        difficulty: 'Easy',
        description: 'Latest banking sector updates and financial awareness',
        subjects: ['Banking', 'Finance', 'RBI', 'Monetary Policy']
      }
    ]
    setTests(mockTests)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'  
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExamTypeColor = (examType: string) => {
    switch (examType) {
      case 'UPSC': return 'bg-blue-100 text-blue-800'
      case 'SSC': return 'bg-purple-100 text-purple-800'
      case 'Banking': return 'bg-green-100 text-green-800'
      case 'Railway': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (showCreator) {
    return <QuizCreator onClose={() => setShowCreator(false)} />
  }

  if (showResults) {
    return <QuizResults onClose={() => setShowResults(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Mock Test Series
              </h1>
              <p className="text-gray-600 text-lg">
                Practice with AI-generated tests and track your performance
              </p>
            </div>
            <Button 
              onClick={() => setShowCreator(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Create Test
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Tests Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">12.5K</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-600">Tests Taken</div>
              </CardContent>
            </Card>
          </div>

          {/* Test Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg leading-tight">
                      {test.title}
                    </CardTitle>
                    <Badge className={getExamTypeColor(test.examType)}>
                      {test.examType}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {test.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Test Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{test.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span>{test.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{test.attempts} attempts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-gray-400" />
                        <span>{test.topScore}% top score</span>
                      </div>
                    </div>

                    {/* Difficulty & Subjects */}
                    <div className="space-y-2">
                      <Badge className={getDifficultyColor(test.difficulty)}>
                        {test.difficulty}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {test.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1"
                        onClick={() => setActiveTest(test)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowResults(true)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Tests
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
