// types/course.ts
export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tier: 'free' | 'premium';
  price: number;
  thumbnail_url?: string;
  instructor_name?: string;
  duration_hours: number;
  total_videos: number;
  videos?: Video[];
}

export interface Video {
  id: string;
  course_id?: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  order_index: number;
  tier: 'free' | 'premium';
  progress?: number;
}
