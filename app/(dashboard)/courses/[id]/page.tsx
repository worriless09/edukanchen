// app/(dashboard)/courses/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import VideoPlayer from '@/components/video-player/VideoPlayer';
import VideoList from '@/components/courses/VideoList';
import { Course, Video } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, Star, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user, hasAccess } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchCourseData();
  }, [params.id]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', params.id)
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (videosError) throw videosError;
      setVideos(videosData || []);
      
      if (videosData && videosData.length > 0) {
        setSelectedVideo(videosData[0]);
      }

      // Fetch user progress if logged in
      if (user) {
        const { data: progressData } = await supabase
          .from('video_progress')
          .select('video_id, progress_percentage')
          .eq('user_id', user.id);

        const progressMap: Record<string, number> = {};
        progressData?.forEach(item => {
          progressMap[item.video_id] = item.progress_percentage;
        });
        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleProgressUpdate = (progressPercent: number) => {
    if (selectedVideo) {
      setProgress(prev => ({
        ...prev,
        [selectedVideo.id]: progressPercent,
      }));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  const canAccess = hasAccess(course.tier);
  const overallProgress = videos.length > 0 
    ? videos.reduce((sum, video) => sum + (progress[video.id] || 0), 0) / videos.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Link href="/courses" className="text-blue-600 hover:underline">
                ← Back to Courses
              </Link>
              <Badge variant={course.tier === 'free' ? 'secondary' : 'default'}>
                {course.tier === 'premium' && !canAccess && <Lock className="h-3 w-3 mr-1" />}
                {course.tier}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold">{course.title}</h1>
            
            {course.description && (
              <p className="text-gray-600 text-lg">{course.description}</p>
            )}
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {course.category?.toUpperCase()}
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration_hours}h total
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.total_videos} videos
              </div>
              
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                4.8 rating
              </div>
            </div>

            {user && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your Progress</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {course.instructor_name && (
              <div className="mb-4">
                <h3 className="font-semibold">Instructor</h3>
                <p className="text-gray-600">{course.instructor_name}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">
                  {course.price > 0 ? `₹${course.price}` : 'Free'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{course.duration_hours} hours</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Videos:</span>
                <span>{course.total_videos}</span>
              </div>
            </div>

            {!canAccess && (
              <div className="mt-6">
                <Link href="/pricing">
                  <Button className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to Access
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Video Player and Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedVideo ? (
            <VideoPlayer
              video={selectedVideo}
              onProgressUpdate={handleProgressUpdate}
            />
          ) : (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
              <p>Select a video to start learning</p>
            </div>
          )}
          
          {selectedVideo && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{selectedVideo.title}</CardTitle>
              </CardHeader>
              {selectedVideo.description && (
                <CardContent>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        <div>
          <VideoList
            courseId={params.id}
            selectedVideoId={selectedVideo?.id}
            onVideoSelect={handleVideoSelect}
          />
        </div>
      </div>
    </div>
  );
}