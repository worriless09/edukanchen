// app/progress/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, Clock, Target, Award, BookOpen, 
  Calendar, BarChart3, Users, Star, Trophy,
  CheckCircle, AlertCircle, PlayCircle
} from "lucide-react"

const progressData = {
  overall: 75,
  weeklyStudyHours: 42,
  testScore: 78,
  rank: 145,
  streak: 15,
  completedTopics: 128,
  totalTopics: 180
}

const subjectProgress = [
  { name: "History", progress: 85, color: "blue", topics: 25, completed: 21 },
  { name: "Geography", progress: 72, color: "green", topics: 20, completed: 14 },
  { name: "Polity", progress: 68, color: "purple", topics: 18, completed: 12 },
  { name: "Economics", progress: 45, color: "orange", topics: 15, completed: 7 },
  { name: "Environment", progress: 90, color: "teal", topics: 12, completed: 11 },
  { name: "Current Affairs", progress: 55, color: "red", topics: 30, completed: 16 }
]

const recentActivities = [
  { type: "test", title: "UPSC Prelims Mock Test 15", score: 78, date: "2 hours ago" },
  { type: "study", title: "Indian Constitution - Articles 1-50", duration: "2.5 hours", date: "1 day ago" },
  { type: "flashcard", title: "Important Dates in Indian History", cards: 45, date: "2 days ago" },
  { type: "test", title: "Geography - Physical Features", score: 82, date: "3 days ago" }
]

const weeklyData = [
  { day: "Mon", hours: 6 },
  { day: "Tue", hours: 8 },
  { day: "Wed", hours: 5 },
  { day: "Thu", hours: 7 },
  { day: "Fri", hours: 6 },
  { day: "Sat", hours: 4 },
  { day: "Sun", hours: 6 }
]

export default function ProgressPage() {
  const getColorClass = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      teal: "bg-teal-500",
      red: "bg-red-500"
    }
    return colorMap[color as keyof typeof colorMap] || "bg-blue-500"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "test": return <Target className="w-4 h-4" />
      case "study": return <BookOpen className="w-4 h-4" />
      case "flashcard": return <PlayCircle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your learning journey and stay motivated</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{progressData.overall}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{progressData.weeklyStudyHours}h</div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{progressData.testScore}%</div>
              <div className="text-sm text-gray-600">Avg Test Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">#{progressData.rank}</div>
              <div className="text-sm text-gray-600">Current Rank</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{progressData.streak} days</div>
                    <div className="text-gray-600">Keep going! You&apos;re on fire!</div>
                  </div>
                  <div className="text-6xl">🔥</div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mt-6">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                      </div>
                      <div className={`w-8 h-8 rounded-full ${i < 5 ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center`}>
                        {i < 5 && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjectProgress.map((subject, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{subject.name}</span>
                        <span className="text-sm text-gray-600">
                          {subject.completed}/{subject.topics} topics
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={subject.progress} className="flex-1" />
                        <span className="text-sm font-medium text-gray-700 w-12">
                          {subject.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Study Hours Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Study Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-40 gap-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-500 rounded-t w-full min-h-4 flex items-end justify-center text-white text-xs font-medium"
                        style={{ height: `${(day.hours / 8) * 100}%` }}
                      >
                        {day.hours > 4 && `${day.hours}h`}
                      </div>
                      <div className="text-xs text-gray-600 mt-2">{day.day}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  Total this week: {weeklyData.reduce((acc, day) => acc + day.hours, 0)} hours
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Topics Completed</span>
                  <span className="font-semibold">{progressData.completedTopics}/{progressData.totalTopics}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tests Taken</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Flashcards Reviewed</span>
                  <span className="font-semibold">1,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Study Sessions</span>
                  <span className="font-semibold">89</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{activity.title}</div>
                        <div className="text-xs text-gray-600">
                          {'score' in activity && `Score: ${activity.score}%`}
                          {'duration' in activity && `Duration: ${activity.duration}`}
                          {'cards' in activity && `${activity.cards} cards`}
                        </div>
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-600" />
                    <div>
                      <div className="font-medium text-sm">15 Day Streak</div>
                      <div className="text-xs text-gray-600">Consistency champion!</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <Star className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Top 200</div>
                      <div className="text-xs text-gray-600">Rank achievement</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">History Master</div>
                      <div className="text-xs text-gray-600">85% subject completion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Continue Learning
          </Button>
          <Button size="lg" variant="outline">
            Take a Test
          </Button>
          <Button size="lg" variant="outline">
            Review Flashcards
          </Button>
        </div>
      </div>
    </div>
  )
}