import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    if (!video) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (video.size > maxSize) {
      return NextResponse.json({ error: 'File size too large (max 500MB)' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi']
    if (!allowedTypes.includes(video.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const bytes = await video.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${video.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = path.join(uploadDir, filename)

    // Write file to disk
    await writeFile(filepath, buffer)

    // Save metadata to database (mock implementation)
    const videoData = {
      id: `video_${timestamp}`,
      title,
      description,
      category,
      filename,
      url: `/uploads/videos/${filename}`,
      size: video.size,
      type: video.type,
      uploadedAt: new Date().toISOString(),
      duration: null, // Would be extracted using ffmpeg
      thumbnail: null, // Would be generated
      views: 0,
      likes: 0
    }

    // TODO: Save to actual database
    console.log('Video saved:', videoData)

    return NextResponse.json({
      success: true,
      video: videoData
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Mock video data - replace with database query
    const mockVideos = [
      {
        id: 'video_1',
        title: 'UPSC Prelims Strategy 2024',
        description: 'Complete strategy for UPSC Prelims preparation',
        category: 'UPSC',
        url: '/uploads/videos/sample1.mp4',
        thumbnail: '/uploads/thumbnails/sample1.jpg',
        duration: 1800, // 30 minutes
        views: 1245,
        likes: 89,
        uploadedAt: '2024-08-25T10:00:00Z'
      },
      {
        id: 'video_2', 
        title: 'SSC CGL Math Tricks',
        description: 'Quick math solving techniques for SSC CGL',
        category: 'SSC',
        url: '/uploads/videos/sample2.mp4',
        thumbnail: '/uploads/thumbnails/sample2.jpg',
        duration: 1200, // 20 minutes
        views: 892,
        likes: 67,
        uploadedAt: '2024-08-24T15:30:00Z'
      }
    ]

    let filteredVideos = mockVideos
    if (category) {
      filteredVideos = mockVideos.filter(video => video.category === category)
    }

    const paginatedVideos = filteredVideos.slice(0, limit)

    return NextResponse.json({
      videos: paginatedVideos,
      total: filteredVideos.length
    })

  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
