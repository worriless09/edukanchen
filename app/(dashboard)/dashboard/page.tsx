// app/(dashboard)/dashboard/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Play, 
  Brain, 
  FileText, 
  TrendingUp, 
  Clock,
  Award,
  Target,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import SubscriptionStatus from '@/components/payments/SubscriptionStatus';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StudyMaterialsSection } from '@/components/study-materials-section';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalFlashcards: number;
  dueFlashcards: number;
  totalTestAttempts: number;
  averageScore: number;
  studyStreak: number;
}

// Loading component
const SectionSkeleton = () => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalFlashcards: 0,
    dueFlashcards: 0,
    totalTestAttempts: 0,
    averageScore: 0,
    studyStreak: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgraded');
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's course progress
      const { data: courseProgress } = await supabase
        .from('video_progress')
        .select(`
          video_id,
          progress_percentage,
          completed,
          videos (
            course_id,
            courses (
              id,
              title
            )
          )
        `)
        .eq('user_id', user.id);

      // Fetch flashcards stats
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('next_review_date, review_count')
        .eq('user_id', user.id);

      // Fetch test attempts
      const { data: testAttempts } = await supabase
        .from('user_test_attempts')
        .select('percentage, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      // Calculate stats
      const uniqueCourses = new Set(
        courseProgress?.map((cp: any) => cp.videos?.courses?.id).filter(Boolean)
      );
      
      const completedVideos = courseProgress?.filter((cp: any) => cp.completed) || [];
      const completedCourseIds = new Set(
        completedVideos.map((cv: any) => cv.videos?.courses?.id).filter(Boolean)
      );

      const now = new Date();
      const dueCards = flashcards?.filter(card => 
        new Date(card.next_review_date) <= now
      ) || [];

      const avgScore = testAttempts?.length 
        ? testAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / testAttempts.length
        : 0;

      setStats({
        totalCourses: uniqueCourses.size,
        completedCourses: completedCourseIds.size,
        totalFlashcards: flashcards?.length || 0,
        dueFlashcards: dueCards.length,
        totalTestAttempts: testAttempts?.length || 0,
        averageScore: Math.round(avgScore),
        studyStreak: 7, // Placeholder - implement streak calculation
      });

      // Set recent activity
      const activities = [
        ...(testAttempts?.slice(0, 3).map(attempt => ({
          type: 'test',
          title: 'Mock Test Completed',
          subtitle: `Score: ${attempt.percentage.toFixed(1)}%`,
          time: attempt.completed_at,
          icon: FileText,
        })) || []),
        ...(courseProgress?.slice(0, 2).map((cp: any) => ({
          type: 'video',
          title: cp.videos?.courses?.title || 'Course Progress',
          subtitle: `${cp.progress_percentage.toFixed(0)}% complete`,
          time: cp.last_watched_at,
          icon: Play,
        })) || []),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="p-6 text-center">Something went wrong. Please refresh the page.</div>}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Study Streak</div>
            <div className="text-2xl font-bold text-orange-600 flex items-center">
              🔥 {stats.studyStreak} days
            </div>
          </div>
        </div>

        {/* Upgrade Success Alert */}
        {upgraded && (
          <Alert className="bg-green-50 border-green-200">
            <Award className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Congratulations! You've successfully upgraded to Premium. Enjoy unlimited access to all features!
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="text-2xl font-bold">{stats.completedCourses}/{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats.totalCourses > 0 ? (stats.completedCourses / stats.totalCourses) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flashcards Due</p>
                  <p className="text-2xl font-bold text-red-600">{stats.dueFlashcards}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Total: {stats.totalFlashcards} cards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Test Average</p>
                  <p className="text-2xl font-bold text-green-600">{stats.averageScore}%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {stats.totalTestAttempts} tests taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <p className="text-2xl font-bold text-green-600">+12%</p>
                  </div>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.dueFlashcards > 0 && (
                <Link href="/flashcards">
                  <Button className="w-full justify-between" variant="outline">
                    <span>Review Flashcards</span>
                    <Badge variant="destructive">{stats.dueFlashcards}</Badge>
                  </Button>
                </Link>
              )}
              
              <Link href="/mock-tests">
                <Button className="w-full justify-between" variant="outline">
                  <span>Take Mock Test</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/courses">
                <Button className="w-full justify-between" variant="outline">
                  <span>Continue Learning</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/pyqs">
                <Button className="w-full justify-between" variant="outline">
                  <span>Practice PYQs</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.subtitle}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTimeAgo(activity.time)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-xs">Start learning to see your progress here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <div>
            <SubscriptionStatus />
          </div>
        </div>

        {/* Today's Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Watch 2 video lectures</span>
                </div>
                <Badge variant="outline">1/2</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Review {Math.min(stats.dueFlashcards, 20)} flashcards</span>
                </div>
                <Badge variant="outline">0/{Math.min(stats.dueFlashcards, 20)}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Complete 1 mock test</span>
                </div>
                <Badge variant="outline">0/1</Badge>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Progress</span>
                <span>33%</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Study Materials Section */}
        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary fallback={<div className="p-6 text-center">Error loading study materials.</div>}>
              <Suspense fallback={<SectionSkeleton />}>
                <StudyMaterialsSection />
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}