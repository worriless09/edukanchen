'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, 
  SkipBack, SkipForward, Settings, ThumbsUp, 
  Share, Download, MessageCircle, Clock, Eye 
} from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  category: string
  url: string
  thumbnail?: string
  duration: number
  views: number
  likes: number
  uploadedAt: string
}

interface VideoPlayerProps {
  video: Video
  onClose: () => void
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Array<{id: string, text: string, author: string, time: string}>>([])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const updateTime = () => setCurrentTime(videoElement.currentTime)
    const updateDuration = () => setDuration(videoElement.duration)

    videoElement.addEventListener('timeupdate', updateTime)
    videoElement.addEventListener('loadedmetadata', updateDuration)

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime)
      videoElement.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isPlaying) {
      videoElement.pause()
    } else {
      videoElement.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const time = parseFloat(e.target.value)
    videoElement.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isMuted) {
      videoElement.volume = volume
      setIsMuted(false)
    } else {
      videoElement.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const addComment = () => {
    if (!comment.trim()) return

    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: 'Current User',
      time: new Date().toLocaleString()
    }

    setComments(prev => [newComment, ...prev])
    setComment('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold truncate">{video.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-4">
            <div 
              className="relative bg-black rounded-lg overflow-hidden group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={video.url}
                className="w-full aspect-video"
                onClick={togglePlay}
              />

              {/* Video Controls */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => skip(-10)}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => skip(10)}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-white hover:bg-opacity-20"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge>{video.category}</Badge>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(video.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like ({video.likes})
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <p className="text-gray-700">{video.description}</p>
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments
            </h3>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={addComment} 
                size="sm" 
                disabled={!comment.trim()}
              >
                Post Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map(comment => (
                <div key={comment.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
