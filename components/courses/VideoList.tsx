// components/courses/VideoList.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Video } from '@/types/course';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Lock, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VideoListProps {
  courseId: string;
  selectedVideoId?: string;
  onVideoSelect: (video: Video) => void;
}

export default function VideoList({ courseId, selectedVideoId, onVideoSelect }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user, hasAccess } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchVideos();
    if (user) {
      fetchProgress();
    }
  }, [courseId, user]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_progress')
        .select('video_id, progress_percentage')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const progressMap: Record<string, number> = {};
      data?.forEach(item => {
        progressMap[item.video_id] = item.progress_percentage;
      });
      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Course Content</h3>
      
      {videos.map((video, index) => {
        const canAccess = hasAccess(video.tier);
        const videoProgress = progress[video.id] || 0;
        const isSelected = selectedVideoId === video.id;
        const isCompleted = videoProgress >= 90;

        return (
          <Card 
            key={video.id} 
            className={`cursor-pointer transition-colors ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            } ${!canAccess ? 'opacity-60' : ''}`}
            onClick={() => canAccess && onVideoSelect(video)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {!canAccess ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Play className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium truncate">
                      {index + 1}. {video.title}
                    </h4>
                    
                    <div className="flex items-center text-xs text-gray-500 ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  
                  {video.description && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {video.description}
                    </p>
                  )}
                  
                  {canAccess && videoProgress > 0 && (
                    <div className="mt-2">
                      <Progress value={videoProgress} className="h-1" />
                      <span className="text-xs text-gray-500">
                        {Math.round(videoProgress)}% complete
                      </span>
                    </div>
                  )}
                  
                  {!canAccess && (
                    <div className="mt-1">
                      <span className="text-xs text-orange-600 font-medium">
                        Premium required
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}