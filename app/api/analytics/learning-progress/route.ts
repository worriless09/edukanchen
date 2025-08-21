// app/api/analytics/learning-progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's learning analytics
    const [sessionsData, requestsData] = await Promise.all([
      supabase
        .from('lab_sessions')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('ai_requests')
        .select('*')
        .eq('user_id', user.id)
    ]);

    const sessions = sessionsData.data || [];
    const requests = requestsData.data || [];

    // Calculate analytics
    const analytics = {
      studyStreak: calculateStudyStreak(sessions),
      labsCompleted: sessions.length,
      aiRequestsCount: requests.length,
      knowledgeScore: calculateKnowledgeScore(sessions, requests),
      recentActivity: sessions.slice(-10),
      topTopics: getTopTopics(requests)
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function calculateStudyStreak(sessions: any[]): number {
  if (!sessions.length) return 0;

  // Sort by date (most recent first)
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  let streak = 1;
  let currentDate = new Date(sorted[0].updated_at);

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i].updated_at);
    const diffDays = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      break; // streak ended
    }
  }

  return streak;
}

function calculateKnowledgeScore(sessions: any[], requests: any[]): number {
  // Simple heuristic: sessions + requests weighted equally, max 100
  const sessionScore = Math.min(sessions.length * 5, 50);
  const requestScore = Math.min(requests.length * 5, 50);
  return sessionScore + requestScore;
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
