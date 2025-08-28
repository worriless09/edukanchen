// components/video-player/VideoPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    video_url: string;
    duration: number;
    tier: 'free' | 'premium';
  };
  onProgressUpdate?: (progress: number) => void;
}

export default function VideoPlayer({ video, onProgressUpdate }: VideoPlayerProps) {
  const { user, hasAccess } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<NodeJS.Timeout>();
  const supabase = createClient();

  const canAccess = hasAccess(video.tier);

  useEffect(() => {
    if (!canAccess) return;

    const updateProgress = () => {
      if (videoRef.current && user) {
        const progressPercent = (currentTime / video.duration) * 100;
        setProgress(progressPercent);
        
        // Update progress in database every 10 seconds
        if (Math.floor(currentTime) % 10 === 0) {
          supabase
            .from('video_progress')
            .upsert({
              user_id: user.id,
              video_id: video.id,
              progress_percentage: progressPercent,
              completed: progressPercent >= 90,
              last_watched_at: new Date().toISOString(),
            })
            .then();
        }
        
        onProgressUpdate?.(progressPercent);
      }
    };

    if (isPlaying) {
      progressRef.current = setInterval(updateProgress, 1000);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying, currentTime, video.id, video.duration, user, canAccess, onProgressUpdate, supabase]);

  const togglePlay = () => {
    if (!videoRef.current || !canAccess) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgressClick = (value: number[]) => {
    if (!videoRef.current || !canAccess) return;
    const newTime = (value[0] / 100) * video.duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current || !canAccess) return;
    videoRef.current.currentTime += seconds;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!canAccess) {
    return (
      <div className="relative w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-2">Premium Content</h3>
          <p className="mb-4">Upgrade to premium to access this video</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={video.video_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.volume = volume;
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              onValueChange={handleProgressClick}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-white text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(video.duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.requestFullscreen();
                }
              }}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
