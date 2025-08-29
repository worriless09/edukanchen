// app/api/analytics/user/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface StudyAnalytics {
  user_id: string;
  date: string;
  total_study_time: number;
  flashcards_reviewed: number;
  quizzes_completed: number;
  average_quiz_score: number;
  topics_studied: string[];
  weak_areas: string[];
  created_at: string;
}

interface StudySession {
  id: string;
  user_id: string;
  session_type: 'quiz' | 'flashcard' | 'practice' | 'mock_test';
  topic: string;
  duration_minutes: number;
  score_percentage: number;
  questions_attempted: number;
  correct_answers: number;
  created_at: string;
}

interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  action_text?: string;
  action_url?: string;
  priority: 'high' | 'medium' | 'low';
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Fetch analytics data in parallel
    const [analyticsResult, sessionsResult] = await Promise.all([
      supabase
        .from('user_study_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date'),
      
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at'),
    ]);

    const analytics: StudyAnalytics[] = analyticsResult.data || [];
    const studySessions: StudySession[] = sessionsResult.data || [];

    // Generate performance insights
    const insights = generateLearningInsights(analytics, studySessions);

    // Calculate summary statistics
    const summary = calculateSummaryStats(analytics, studySessions);

    return NextResponse.json({
      analytics,
      study_sessions: studySessions,
      insights,
      summary,
      period: parseInt(period)
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function generateLearningInsights(
  analytics: StudyAnalytics[], 
  studySessions: StudySession[]
): LearningInsight[] {
  const insights: LearningInsight[] = [];

  // Calculate average performance
  const avgScore = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + (a.average_quiz_score || 0), 0) / analytics.length
    : 0;

  if (avgScore > 85) {
    insights.push({
      id: '1',
      type: 'strength',
      title: 'Excellent Quiz Performance',
      description: `Your average score is ${Math.round(avgScore)}%. You're performing exceptionally well!`,
      priority: 'medium'
    });
  } else if (avgScore > 75) {
    insights.push({
      id: '1',
      type: 'achievement',
      title: 'Good Quiz Performance',
      description: `Your average score is ${Math.round(avgScore)}%. You're on the right track!`,
      priority: 'low'
    });
  } else if (avgScore < 60) {
    insights.push({
      id: '2',
      type: 'weakness',
      title: 'Quiz Performance Needs Improvement',
      description: `Your average score is ${Math.round(avgScore)}%. Focus on reviewing weak areas more thoroughly.`,
      action_text: 'View Weak Topics',
      action_url: '/analytics/weak-topics',
      priority: 'high'
    });
  }

  // Check recent performance trends
  if (studySessions.length >= 5) {
    const recent = studySessions.slice(-5);
    const recentAvgScore = recent.reduce((sum, s) => sum + (s.score_percentage || 0), 0) / recent.length;
    
    if (recentAvgScore > avgScore + 10) {
      insights.push({
        id: '3',
        type: 'strength',
        title: 'Improving Performance Trend',
        description: 'Your recent scores show significant improvement. Keep up the momentum!',
        priority: 'medium'
      });
    } else if (recentAvgScore < avgScore - 10) {
      insights.push({
        id: '3',
        type: 'recommendation',
        title: 'Recent Performance Decline',
        description: 'Your recent scores have dropped. Consider reviewing your study approach.',
        action_text: 'Review Study Plan',
        action_url: '/study-plan',
        priority: 'high'
      });
    }
  }

  // Study consistency analysis
  const studyDays = analytics.filter(a => a.total_study_time > 0).length;
  const consistency = analytics.length > 0 ? studyDays / analytics.length : 0;

  if (consistency > 0.8) {
    insights.push({
      id: '4',
      type: 'strength',
      title: 'Excellent Study Consistency',
      description: `You've studied ${Math.round(consistency * 100)}% of days. Consistency is key to exam success!`,
      priority: 'low'
    });
  } else if (consistency < 0.5) {
    insights.push({
      id: '5',
      type: 'recommendation',
      title: 'Improve Study Consistency',
      description: 'Regular study habits yield better results than cramming. Aim for daily practice.',
      action_text: 'Set Study Reminders',
      action_url: '/settings/reminders',
      priority: 'high'
    });
  }

  // Time management insights
  const avgStudyTime = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + (a.total_study_time || 0), 0) / analytics.length
    : 0;

  if (avgStudyTime > 180) { // 3+ hours
    insights.push({
      id: '6',
      type: 'recommendation',
      title: 'Consider Study Breaks',
      description: 'You\'re studying intensively. Remember to take breaks for better retention.',
      action_text: 'Learn About Study Techniques',
      action_url: '/study-techniques',
      priority: 'medium'
    });
  } else if (avgStudyTime < 30) { // Less than 30 mins
    insights.push({
      id: '7',
      type: 'recommendation',
      title: 'Increase Study Time',
      description: 'Consider dedicating more time to study for better exam preparation.',
      action_text: 'Create Study Schedule',
      action_url: '/study-schedule',
      priority: 'high'
    });
  }

  // Sort insights by priority
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function calculateSummaryStats(analytics: StudyAnalytics[], studySessions: StudySession[]) {
  const totalStudyTime = analytics.reduce((sum, a) => sum + (a.total_study_time || 0), 0);
  const totalFlashcards = analytics.reduce((sum, a) => sum + (a.flashcards_reviewed || 0), 0);
  const totalQuizzes = analytics.reduce((sum, a) => sum + (a.quizzes_completed || 0), 0);
  const avgScore = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + (a.average_quiz_score || 0), 0) / analytics.length
    : 0;

  return {
    total_study_time_minutes: totalStudyTime,
    total_flashcards_reviewed: totalFlashcards,
    total_quizzes_completed: totalQuizzes,
    average_quiz_score: Math.round(avgScore * 10) / 10,
    study_days: analytics.filter(a => a.total_study_time > 0).length,
    consistency_percentage: analytics.length > 0 
      ? Math.round((analytics.filter(a => a.total_study_time > 0).length / analytics.length) * 100)
      : 0
  };
}