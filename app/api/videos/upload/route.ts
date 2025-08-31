// app/api/videos/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
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

    // Create video record (use your existing Supabase client)
    const videoData = {
      id: `video_${Date.now()}`,
      title,
      description,
      category,
      filename: video.name,
      url: `/uploads/videos/${video.name}`,
      size: video.size,
      type: video.type,
      uploadedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      video: videoData
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
