'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { VideoPlayer } from './VideoPlayer'
import { Play, Search, Filter, Eye, ThumbsUp, Clock } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  category: string
  url: string
  thumbnail: string
  duration: number
  views: number
  likes: number
  uploadedAt: string
}

export function VideoLibrary() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideos()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [videos, searchQuery, selectedCategory])

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/upload-video')
      const data = await response.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Failed to load videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterVideos = () => {
    let filtered = videos

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(video => video.category === selectedCategory)
    }

    setFilteredVideos(filtered)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railway', 'Defense', 'General']

  if (selectedVideo) {
    return (
      <VideoPlayer 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-6 w-6" />
          Video Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-gray-500">Loading videos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-8">
            <Play className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredVideos.map(video => (
              <Card 
                key={video.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(video.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {video.likes}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
