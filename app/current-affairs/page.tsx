'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  BookOpen, 
  Globe, 
  TrendingUp, 
  Users,
  Flag,
  Briefcase,
  Zap
} from 'lucide-react'

interface CurrentAffair {
  id: string
  title: string
  summary: string
  category: 'national' | 'international' | 'economy' | 'science' | 'sports' | 'environment'
  date: string
  importance: 'critical' | 'important' | 'moderate'
  tags: string[]
  readTime: number
  source: string
}

export default function CurrentAffairs() {
  const [affairs, setAffairs] = useState<CurrentAffair[]>([])
  const [filteredAffairs, setFilteredAffairs] = useState<CurrentAffair[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockAffairs: CurrentAffair[] = [
      {
        id: '1',
        title: 'India Launches New Space Mission to Mars',
        summary: 'ISRO successfully launched its second Mars mission with advanced scientific instruments to study Martian atmosphere and geology.',
        category: 'science',
        date: '2025-08-31',
        importance: 'critical',
        tags: ['ISRO', 'Mars Mission', 'Space Technology'],
        readTime: 5,
        source: 'Space Research Organization'
      },
      {
        id: '2',
        title: 'New Economic Policy Announced for MSMEs',
        summary: 'Government introduces comprehensive support package for micro, small and medium enterprises with focus on digital transformation.',
        category: 'economy',
        date: '2025-08-30',
        importance: 'important',
        tags: ['MSME', 'Economic Policy', 'Digital Transformation'],
        readTime: 4,
        source: 'Ministry of Finance'
      },
      {
        id: '3',
        title: 'Climate Change Summit Concludes with New Agreements',
        summary: 'International climate summit results in landmark agreements on renewable energy transition and carbon emission targets.',
        category: 'environment',
        date: '2025-08-29',
        importance: 'critical',
        tags: ['Climate Change', 'Renewable Energy', 'International'],
        readTime: 6,
        source: 'Environmental Agency'
      },
      {
        id: '4',
        title: 'India Wins Cricket World Championship',
        summary: 'Indian cricket team defeats Australia in thrilling final to claim the World Championship title after 8 years.',
        category: 'sports',
        date: '2025-08-28',
        importance: 'moderate',
        tags: ['Cricket', 'World Championship', 'Sports'],
        readTime: 3,
        source: 'Sports Authority'
      },
      {
        id: '5',
        title: 'New Education Technology Initiative Launched',
        summary: 'Ministry of Education launches nationwide program to integrate AI and machine learning in school curricula.',
        category: 'national',
        date: '2025-08-27',
        importance: 'important',
        tags: ['Education', 'AI', 'Technology', 'Schools'],
        readTime: 4,
        source: 'Ministry of Education'
      },
      {
        id: '6',
        title: 'G20 Summit Addresses Global Economic Challenges',
        summary: 'World leaders discuss strategies to address inflation, supply chain disruptions, and sustainable development goals.',
        category: 'international',
        date: '2025-08-26',
        importance: 'critical',
        tags: ['G20', 'Global Economy', 'International Relations'],
        readTime: 7,
        source: 'International News'
      }
    ]
    
    setTimeout(() => {
      setAffairs(mockAffairs)
      setFilteredAffairs(mockAffairs)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = affairs

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(affair => affair.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(affair => 
        affair.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affair.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affair.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === 'importance') {
        const importanceOrder = { 'critical': 3, 'important': 2, 'moderate': 1 }
        return importanceOrder[b.importance] - importanceOrder[a.importance]
      }
      return 0
    })

    setFilteredAffairs(filtered)
  }, [affairs, selectedCategory, searchQuery, sortBy])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'national':
        return <Flag className="h-4 w-4" />
      case 'international':
        return <Globe className="h-4 w-4" />
      case 'economy':
        return <TrendingUp className="h-4 w-4" />
      case 'science':
        return <Zap className="h-4 w-4" />
      case 'sports':
        return <Users className="h-4 w-4" />
      case 'environment':
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'important':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'moderate':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryStats = () => {
    const categories = ['national', 'international', 'economy', 'science', 'sports', 'environment']
    return categories.map(category => ({
      name: category,
      count: affairs.filter(affair => affair.category === category).length,
      icon: getCategoryIcon(category)
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
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
            <h1 className="text-3xl font-bold text-gray-900">Current Affairs</h1>
            <p className="text-gray-600 mt-2">Stay updated with the most important happenings around the world</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {getCategoryStats().map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 capitalize">{stat.name}</p>
                    <p className="text-lg font-bold">{stat.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search current affairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Latest First</SelectItem>
            <SelectItem value="importance">By Importance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="national">National</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="economy">Economy</TabsTrigger>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredAffairs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No current affairs found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No results found for "${searchQuery}"` 
                    : 'No current affairs available in this category.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredAffairs.map((affair) => (
                <Card key={affair.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            {getCategoryIcon(affair.category)}
                            <span className="capitalize">{affair.category}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getImportanceColor(affair.importance)}
                          >
                            {affair.importance.toUpperCase()}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{affair.readTime} min read</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2 hover:text-blue-600 cursor-pointer">
                          {affair.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {new Date(affair.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} • {affair.source}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">{affair.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {affair.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Bookmark
                        </Button>
                        <Button size="sm">
                          Read Full Article
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}