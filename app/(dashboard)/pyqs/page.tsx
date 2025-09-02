'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  BookOpen, 
  Calendar, 
  Clock, 
  Star,
  TrendingUp,
  FileText,
  Target,
  Award,
  BarChart3
} from 'lucide-react'

interface PYQSet {
  id: string
  exam: string
  subject: string
  year: number
  totalQuestions: number
  duration: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topics: string[]
  downloadUrl?: string
  hasVideo: boolean
  averageScore: number
  totalAttempts: number
  isPopular: boolean
}

interface UserProgress {
  attempted: number
  completed: number
  averageScore: number
  totalQuestions: number
}

export default function PYQs() {
  const [pyqSets, setPyqSets] = useState<PYQSet[]>([])
  const [filteredSets, setFilteredSets] = useState<PYQSet[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [userProgress, setUserProgress] = useState<UserProgress>({
    attempted: 45,
    completed: 32,
    averageScore: 78.5,
    totalQuestions: 450
  })
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockPyqSets: PYQSet[] = [
      {
        id: '1',
        exam: 'JEE Main',
        subject: 'Physics',
        year: 2024,
        totalQuestions: 30,
        duration: 90,
        difficulty: 'Hard',
        topics: ['Mechanics', 'Thermodynamics', 'Optics'],
        hasVideo: true,
        averageScore: 72.5,
        totalAttempts: 1250,
        isPopular: true
      },
      {
        id: '2',
        exam: 'JEE Main',
        subject: 'Chemistry',
        year: 2024,
        totalQuestions: 30,
        duration: 90,
        difficulty: 'Medium',
        topics: ['Organic Chemistry', 'Physical Chemistry', 'Inorganic Chemistry'],
        hasVideo: true,
        averageScore: 68.3,
        totalAttempts: 1180,
        isPopular: true
      },
      {
        id: '3',
        exam: 'JEE Main',
        subject: 'Mathematics',
        year: 2024,
        totalQuestions: 30,
        duration: 90,
        difficulty: 'Hard',
        topics: ['Calculus', 'Algebra', 'Coordinate Geometry'],
        hasVideo: true,
        averageScore: 65.8,
        totalAttempts: 1320,
        isPopular: true
      },
      {
        id: '4',
        exam: 'NEET',
        subject: 'Biology',
        year: 2024,
        totalQuestions: 50,
        duration: 120,
        difficulty: 'Medium',
        topics: ['Human Physiology', 'Plant Biology', 'Genetics'],
        hasVideo: false,
        averageScore: 76.2,
        totalAttempts: 980,
        isPopular: false
      },
      {
        id: '5',
        exam: 'JEE Advanced',
        subject: 'Physics',
        year: 2023,
        totalQuestions: 18,
        duration: 180,
        difficulty: 'Hard',
        topics: ['Quantum Mechanics', 'Electromagnetic Theory', 'Modern Physics'],
        hasVideo: true,
        averageScore: 58.7,
        totalAttempts: 750,
        isPopular: false
      },
      {
        id: '6',
        exam: 'GATE',
        subject: 'Computer Science',
        year: 2024,
        totalQuestions: 65,
        duration: 180,
        difficulty: 'Medium',
        topics: ['Data Structures', 'Algorithms', 'Database Systems'],
        hasVideo: true,
        averageScore: 71.4,
        totalAttempts: 890,
        isPopular: true
      },
      {
        id: '7',
        exam: 'JEE Main',
        subject: 'Physics',
        year: 2023,
        totalQuestions: 30,
        duration: 90,
        difficulty: 'Medium',
        topics: ['Waves', 'Electricity', 'Magnetism'],
        hasVideo: false,
        averageScore: 69.1,
        totalAttempts: 1100,
        isPopular: false
      },
      {
        id: '8',
        exam: 'NEET',
        subject: 'Chemistry',
        year: 2023,
        totalQuestions: 50,
        duration: 120,
        difficulty: 'Easy',
        topics: ['Chemical Bonding', 'Solutions', 'Electrochemistry'],
        hasVideo: true,
        averageScore: 79.3,
        totalAttempts: 1050,
        isPopular: false
      }
    ]
    
    setTimeout(() => {
      setPyqSets(mockPyqSets)
      setFilteredSets(mockPyqSets)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter logic
  useEffect(() => {
    let filtered = pyqSets

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(set => 
        set.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Exam filter
    if (selectedExam !== 'all') {
      filtered = filtered.filter(set => set.exam === selectedExam)
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(set => set.subject === selectedSubject)
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(set => set.year.toString() === selectedYear)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(set => set.difficulty === selectedDifficulty)
    }

    setFilteredSets(filtered)
  }, [pyqSets, searchQuery, selectedExam, selectedSubject, selectedYear, selectedDifficulty])

  const exams = Array.from(new Set(pyqSets.map(set => set.exam)))
  const subjects = Array.from(new Set(pyqSets.map(set => set.subject)))
  const years = Array.from(new Set(pyqSets.map(set => set.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const popularSets = pyqSets.filter(set => set.isPopular).slice(0, 3)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Previous Year Questions</h1>
            <p className="text-gray-600 mt-2">Practice with authentic exam questions from past years</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Attempted</p>
                  <p className="text-2xl font-bold">{userProgress.attempted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{userProgress.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold">{userProgress.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sets</p>
                  <p className="text-2xl font-bold">{pyqSets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-500">
                {userProgress.completed}/{userProgress.attempted} completed
              </span>
            </div>
            <Progress 
              value={(userProgress.completed / userProgress.attempted) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Popular Sets Section */}
      {popularSets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Popular This Week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularSets.map((set) => (
              <Card key={set.id} className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                      Popular
                    </Badge>
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                  </div>
                  <CardTitle className="text-lg">{set.exam} - {set.subject}</CardTitle>
                  <CardDescription>{set.year} • {set.totalQuestions} Questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={getDifficultyColor(set.difficulty)}>
                      {set.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{set.totalAttempts} attempts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Score: {set.averageScore}%</span>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by exam, subject, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger>
              <SelectValue placeholder="All Exams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {exams.map(exam => (
                <SelectItem key={exam} value={exam}>{exam}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="All Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulty</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredSets.length} Question Sets Found
          </h3>
          {filteredSets.length !== pyqSets.length && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedExam('all')
                setSelectedSubject('all')
                setSelectedYear('all')
                setSelectedDifficulty('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {filteredSets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No question sets found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedExam !== 'all' || selectedSubject !== 'all' || selectedYear !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria or filters'
                  : 'No question sets available at the moment'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSets.map((set) => (
              <Card key={set.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {set.exam}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(set.difficulty)}>
                          {set.difficulty}
                        </Badge>
                        {set.hasVideo && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            Video Solution
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{set.subject}</CardTitle>
                      <CardDescription>
                        {set.year} • {set.totalQuestions} Questions • {set.duration} minutes
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Topics Covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {set.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {set.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{set.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>{set.averageScore}% avg</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{set.totalAttempts} attempts</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <div className="flex space-x-2">
                        {set.hasVideo && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm">
                          Start Practice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Study Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>Study Tips for PYQs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <Target className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Start with Recent Years</p>
                <p className="text-blue-700">Begin with the most recent papers to understand current patterns.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <Clock className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Time Management</p>
                <p className="text-blue-700">Practice under timed conditions to improve speed and accuracy.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <TrendingUp className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Analyze Mistakes</p>
                <p className="text-blue-700">Review incorrect answers and understand the concepts behind them.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}