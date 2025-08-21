// 10. Lab Analytics API
// app/api/labs/analytics/route.ts
export async function POST(request: NextRequest) {
  try {
    const { labId, eventType, eventData } = await request.json();
    
    // Get user from auth
    const authHeader = request.headers.get('authorization');
    const user = await getUser(authHeader); // Your auth logic
    
    const { error } = await supabase
      .from('lab_analytics')
      .insert({
        user_id: user?.id,
        lab_id: labId,
        event_type: eventType,
        event_data: eventData,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track event' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const labId = searchParams.get('labId');
    
    const authHeader = request.headers.get('authorization');
    const user = await getUser(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
    }

    // Fetch analytics data
    let query = supabase
      .from('lab_analytics')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (labId) {
      query = query.eq('lab_id', labId);
    }
    
    const { data: analytics, error } = await query;
    
    if (error) throw error;
    
    // Process analytics data
    const processedData = processAnalyticsData(analytics);
    
    return NextResponse.json({
      success: true,
      ...processedData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' }, 
      { status: 500 }
    );
  }
}

function processAnalyticsData(analytics: any[]) {
  // Calculate key metrics
  const labsCompleted = analytics.filter(a => a.event_type === 'lab_end').length;
  const totalTimeSpent = analytics
    .filter(a => a.event_type === 'lab_end')
    .reduce((sum, a) => sum + (a.event_data?.timeSpent || 0), 0);
  
  // Calculate study streak
  const studyDays = new Set(
    analytics.map(a => new Date(a.created_at).toDateString())
  );
  const studyStreak = calculateStudyStreak(Array.from(studyDays));
  
  // Generate progress data for chart
  const progressData = generateProgressChartData(analytics);
  
  // Calculate subject performance
  const subjectPerformance = calculateSubjectPerformance(analytics);
  
  // Generate AI recommendations
  const aiRecommendations = generateAIRecommendations(analytics);
  
  return {
    studyStreak,
    labsCompleted,
    totalTimeSpent,
    knowledgeScore: calculateKnowledgeScore(analytics),
    progressData,
    subjectPerformance,
    aiRecommendations,
    recentActivity: getRecentActivity(analytics)
  };
}

function calculateStudyStreak(studyDays: string[]): number {
  // Sort dates in descending order
  const sortedDays = studyDays.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const dayStr of sortedDays) {
    const day = new Date(dayStr);
    const diffInDays = Math.floor((currentDate.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === streak) {
      streak++;
      currentDate = day;
    } else {
      break;
    }
  }
  
  return streak;
}

function generateProgressChartData(analytics: any[]) {
  // Group by date and calculate daily scores
  const dailyData = analytics
    .filter(a => a.event_data?.score)
    .reduce((acc, a) => {
      const date = new Date(a.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, scores: [] };
      }
      acc[date].scores.push(a.event_data.score);
      return acc;
    }, {});
  
  return Object.values(dailyData).map((day: any) => ({
    date: day.date,
    score: Math.round(day.scores.reduce((sum, score) => sum + score, 0) / day.scores.length)
  }));
}

function calculateSubjectPerformance(analytics: any[]) {
  // This would analyze performance by subject/topic
  // For now, return mock data - implement based on your HRM data
  return [
    { subject: 'Polity', mastery: 85 },
    { subject: 'History', mastery: 72 },
    { subject: 'Geography', mastery: 90 },
    { subject: 'Economics', mastery: 68 },
    { subject: 'Environment', mastery: 78 }
  ];
}

function generateAIRecommendations(analytics: any[]) {
  // AI-generated study recommendations based on user activity
  return [
    {
      title: "Focus on Economics",
      description: "Your recent performance suggests you need more practice in economic concepts",
      actionUrl: "/labs/adaptive-quiz?subject=economics"
    },
    {
      title: "Try Current Affairs Lab",
      description: "Stay updated with latest developments using our AI analyzer",
      actionUrl: "/labs/current-affairs"
    }
  ];
}

function calculateKnowledgeScore(analytics: any[]): number {
  // Calculate overall knowledge score based on recent performance
  const scores = analytics
    .filter(a => a.event_data?.score)
    .map(a => a.event_data.score);
  
  if (scores.length === 0) return 0;
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getRecentActivity(analytics: any[]) {
  return analytics
    .filter(a => a.event_type === 'lab_end')
    .slice(0, 5)
    .map(a => ({
      labName: a.event_data?.labName || 'Unknown Lab',
      date: new Date(a.created_at).toLocaleDateString(),
      score: a.event_data?.score || 0,
      timeSpent: a.event_data?.timeSpent || 0
    }));
}