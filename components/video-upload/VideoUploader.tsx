'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, Video, X, Check, AlertCircle, Play, Pause } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface VideoFile {
  id: string
  file: File
  title: string
  description: string
  category: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  url?: string
  error?: string
}

const EXAM_CATEGORIES = [
  { value: 'UPSC', label: 'UPSC Civil Services' },
  { value: 'SSC', label: 'SSC Exams' },
  { value: 'Banking', label: 'Banking Exams' },
  { value: 'Railway', label: 'Railway Exams' },
  { value: 'Defense', label: 'Defense Exams' },
  { value: 'General', label: 'General Studies' }
]

export function VideoUploader() {
  const [videos, setVideos] = useState<VideoFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (files: File[]) => {
    const videoFiles = files.filter(file => file.type.startsWith('video/'))
    
    if (videoFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select video files only",
      })
      return
    }

    const newVideos: VideoFile[] = videoFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: '',
      category: 'General',
      status: 'pending',
      progress: 0
    }))

    setVideos(prev => [...prev, ...newVideos])
  }

  const updateVideo = (id: string, updates: Partial<VideoFile>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ))
  }

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id))
  }

  const uploadVideo = async (video: VideoFile) => {
    updateVideo(video.id, { status: 'uploading', progress: 0 })

    const formData = new FormData()
    formData.append('video', video.file)
    formData.append('title', video.title)
    formData.append('description', video.description)
    formData.append('category', video.category)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setVideos(prev => prev.map(v => 
          v.id === video.id ? { ...v, progress: Math.min(v.progress + 10, 90) } : v
        ))
      }, 300)

      // Use existing API route - your codebase already has the structure for this
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const result = await response.json()
        updateVideo(video.id, { 
          status: 'success', 
          progress: 100,
          url: result.video?.url || '#'
        })
        
        toast({
          title: "Upload successful",
          description: `${video.title} has been uploaded successfully`,
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      updateVideo(video.id, { 
        status: 'error', 
        progress: 0,
        error: 'Upload failed'
      })
      
      toast({
        title: "Upload failed",
        description: "Unable to upload video. Please try again.",
      })
    }
  }

  const getStatusIcon = (status: VideoFile['status']) => {
    switch (status) {
      case 'success': return <Check className="h-5 w-5 text-green-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'uploading': return <div className="loading-spinner w-5 h-5" />
      default: return <Video className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Video Upload Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div 
          className={`upload-zone ${isDragging ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Drop video files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports MP4, WebM, MOV files up to 500MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Video List */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Videos ({videos.length})</h3>
            {videos.map(video => (
              <div key={video.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(video.status)}
                    <div>
                      <h4 className="font-medium">{video.title}</h4>
                      <p className="text-sm text-gray-500">
                        {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{video.category}</Badge>
                    {video.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideo(video.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {video.status === 'pending' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Video title"
                      value={video.title}
                      onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                      className="px-3 py-2 border rounded-md"
                    />
                    <textarea
                      placeholder="Description"
                      value={video.description}
                      onChange={(e) => updateVideo(video.id, { description: e.target.value })}
                      className="px-3 py-2 border rounded-md resize-none"
                      rows={1}
                    />
                    <select
                      value={video.category}
                      onChange={(e) => updateVideo(video.id, { category: e.target.value })}
                      className="px-3 py-2 border rounded-md"
                    >
                      {EXAM_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {video.status === 'uploading' && (
                  <div className="space-y-2">
                    <Progress value={video.progress} className="w-full" />
                    <p className="text-sm text-gray-600">
                      Uploading... {video.progress}%
                    </p>
                  </div>
                )}

                {video.status === 'error' && video.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{video.error}</p>
                  </div>
                )}

                {video.status === 'success' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">Upload completed successfully!</p>
                  </div>
                )}

                {video.status === 'pending' && (
                  <Button
                    onClick={() => uploadVideo(video)}
                    className="w-full"
                    disabled={!video.title.trim()}
                  >
                    Upload Video
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
