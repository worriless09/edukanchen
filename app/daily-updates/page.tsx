'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, TrendingUp, BookOpen, Globe, Users } from 'lucide-react'

interface Update {
  id: string
  title: string
  content: string
  category: 'education' | 'technology' | 'government' | 'economy' | 'sports'
  date: string
  time: string
  importance: 'high' | 'medium' | 'low'
  source: string
}

export default function DailyUpdates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUpdates: Update[] = [
      {
        id: '1',
        title: 'New Education Policy Implementation',
        content: 'The Ministry of Education announced new guidelines for digital learning platforms...',
        category: 'education',
        date: '2025-08-31',
        time: '09:30 AM',
        importance: 'high',
        source: 'Ministry of Education'
      },
      {
        id: '2',
        title: 'AI Integration in Competitive Exams',
        content: 'Several examination boards are considering AI-powered assessment tools...',
        category: 'technology',
        date: '2025-08-31',
        time: '11:15 AM',
        importance: 'medium',
        source: 'EdTech News'
      },
      {
        id: '3',
        title: 'Government Scholarship Program Launched',
        content: 'New merit-based scholarship program for engineering and medical students...',
        category: 'government',
        date: '2025-08-31',
        time: '02:45 PM',
        importance: 'high',
        source: 'Government Portal'
      },
      {
        id: '4',
        title: 'Economic Survey Highlights Education Sector',
        content: 'The latest economic survey shows significant growth in the education sector...',
        category: 'economy',
        date: '2025-08-31',
        time: '04:20 PM',
        importance: 'medium',
        source: 'Economic Times'
      }
    ]
    
    setTimeout(() => {
      setUpdates(mockUpdates)
      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education':
        return <BookOpen className="h-4 w-4" />
      case 'technology':
        return <TrendingUp className="h-4 w-4" />
      case 'government':
        return <Users className="h-4 w-4" />
      case 'economy':
        return <Globe className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredUpdates = selectedCategory === 'all' 
    ? updates 
    : updates.filter(update => update.category === selectedCategory)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Daily Updates</h1>
            <p className="text-gray-600 mt-2">Stay informed with the latest news and updates</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Updates</p>
                  <p className="text-2xl font-bold">{updates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold">
                    {updates.filter(u => u.importance === 'high').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-lg font-semibold">Just now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="economy">Economy</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="space-y-4">
            {filteredUpdates.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
                  <p className="text-gray-500">
                    {selectedCategory === 'all' 
                      ? 'No updates available at the moment.' 
                      : `No updates found in the ${selectedCategory} category.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredUpdates.map((update) => (
                <Card key={update.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{update.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(update.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{update.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(update.category)}
                            <span className="capitalize">{update.category}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant="outline" 
                          className={getImportanceColor(update.importance)}
                        >
                          {update.importance.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{update.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Source: {update.source}
                      </div>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}