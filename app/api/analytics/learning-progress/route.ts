// app/api/analytics/learning-progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Add better error handling for auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 401 }
      );
    }

    // Get user's learning analytics with error handling
    const [sessionsResult, requestsResult] = await Promise.allSettled([
      supabase
        .from('lab_sessions')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('ai_requests')
        .select('*')
        .eq('user_id', user.id)
    ]);

    // Handle potential database errors gracefully
    const sessions = sessionsResult.status === 'fulfilled' ? (sessionsResult.value.data || []) : [];
    const requests = requestsResult.status === 'fulfilled' ? (requestsResult.value.data || []) : [];

    // Calculate total study time from sessions
    const totalStudyTime = sessions.reduce((total, session) => {
      // Assuming sessions have duration or start/end times
      return total + (session.duration || 30); // default 30 mins if no duration
    }, 0);

    // Calculate analytics matching your component's expected structure
    const analytics = {
      studyStreak: calculateStudyStreak(sessions),
      knowledgeScore: calculateKnowledgeScore(sessions, requests),
      totalStudyTime: totalStudyTime, // in minutes
      topicsCompleted: getUniqueTopicsCount(sessions, requests),
      weeklyGoal: 300, // 5 hours in minutes - you can make this user-configurable
      weeklyProgress: calculateWeeklyProgress(sessions, 300), // percentage of weekly goal
      
      // Optional: include original data for backwards compatibility
      labsCompleted: sessions.length,
      aiRequestsCount: requests.length,
      recentActivity: sessions.slice(-10),
      topTopics: getTopTopics(requests)
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateStudyStreak(sessions: any[]): number {
  if (!sessions.length) return 0;

  // Sort by date (most recent first)
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's activity today or yesterday to start streak
  const mostRecent = new Date(sorted[0].created_at || sorted[0].updated_at);
  mostRecent.setHours(0, 0, 0, 0);
  
  const daysSinceRecent = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceRecent > 1) return 0; // streak broken
  
  streak = 1;
  let currentDate = mostRecent;

  for (let i = 1; i < sorted.length; i++) {
    const sessionDate = new Date(sorted[i].created_at || sorted[i].updated_at);
    sessionDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = sessionDate;
    } else if (diffDays > 1) {
      break; // streak ended
    }
  }

  return streak;
}

function calculateKnowledgeScore(sessions: any[], requests: any[]): number {
  // More sophisticated scoring
  const sessionScore = Math.min(sessions.length * 3, 40);
  const requestScore = Math.min(requests.length * 2, 30);
  const completionBonus = sessions.filter(s => s.completed).length * 5;
  
  return Math.min(sessionScore + requestScore + completionBonus, 100);
}

function getUniqueTopicsCount(sessions: any[], requests: any[]): number {
  const topics = new Set();
  
  sessions.forEach(session => {
    if (session.topic) topics.add(session.topic);
  });
  
  requests.forEach(request => {
    if (request.request_data?.topic) topics.add(request.request_data.topic);
  });
  
  return topics.size;
}

function calculateWeeklyProgress(sessions: any[], weeklyGoalMinutes: number): number {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.created_at || session.updated_at);
    return sessionDate >= weekStart;
  });
  
  const weeklyMinutes = thisWeekSessions.reduce((total, session) => {
    return total + (session.duration || 30);
  }, 0);
  
  return Math.min(Math.round((weeklyMinutes / weeklyGoalMinutes) * 100), 100);
}

function getTopTopics(requests: any[]): string[] {
  const topicCounts: Record<string, number> = {};

  for (const req of requests) {
    const topic = req.request_data?.topic;
    if (topic) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  }

  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
}
