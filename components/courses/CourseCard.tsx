// components/courses/CourseCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact";  // 👈 optional
  showEnrollButton?: boolean;  
}

export default function CourseCard({ 
  course,
variant = "default", 
  showEnrollButton = true 
}: CourseCardProps) {
  const { hasAccess } = useAuth();
  const canAccess = hasAccess(course.tier);

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow ${variant === "compact" ? "p-2" : ""}`}>
      {/* Thumbnail */}
      <div className="relative">
        <Image
          src={course.thumbnail_url || '/placeholder-course.jpg'}
          alt={course.title}
          width={400}
          height={200}
          className={`w-full ${variant === "compact" ? "h-32" : "h-48"} object-cover rounded-t-lg`}
        />
        
        <div className="absolute top-2 right-2">
          {course.tier === 'premium' && (
            <Badge variant={canAccess ? 'default' : 'destructive'}>
              {canAccess ? 'Premium' : <><Lock className="h-3 w-3 mr-1" />Premium</>}
            </Badge>
          )}
          {course.tier === 'free' && (
            <Badge variant="secondary">Free</Badge>
          )}
        </div>
        
        {course.price > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-green-600">
              ₹{course.price}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className={`font-semibold ${variant === "compact" ? "text-base" : "text-lg"} line-clamp-2`}>
            {course.title}
          </h3>
          
          {variant !== "compact" && course.description && (
            <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
          )}
          
          {course.instructor_name && variant !== "compact" && (
            <p className="text-sm text-blue-600">By {course.instructor_name}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration_hours}h
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.total_videos} videos
              </div>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              4.5
            </div>
          </div>
          
          {showEnrollButton && (
          <div className="pt-2">
            {canAccess ? (
              <Link href={`/courses/${course.id}`}>
                <Button className="w-full">
                  {course.tier === 'free' ? 'Start Learning' : 'Continue Learning'}
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" disabled>
                  <Lock className="h-4 w-4 mr-2" />
                  Premium Required
                </Button>
                <Link href="/pricing">
                  <Button className="w-full" size="sm">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            )}
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
