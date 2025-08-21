// app/api/labs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: labs, error } = await supabase
      .from('labs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ labs });
  } catch (error) {
    console.error('Error fetching labs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch labs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, tool_url, is_public = false } = body;

    const { data: lab, error } = await supabase
      .from('labs')
      .insert({
        name,
        description,
        tool_url,
        creator_id: user.id,
        is_public
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lab }, { status: 201 });
  } catch (error) {
    console.error('Error creating lab:', error);
    return NextResponse.json(
      { error: 'Failed to create lab' },
      { status: 500 }
    );
  }
}





// app/api/ai/generate-flashcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface FlashcardRequest {
  topic: string;
  examType: 'UPSC' | 'SSC' | 'Banking' | 'Railway';
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  count: number;
  includeCurrentAffairs: boolean;
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: FlashcardRequest = await request.json();
    const { topic, examType, difficulty, count, includeCurrentAffairs } = body;

    // Call your HRM service or OpenAI API here
    const flashcards = await generateFlashcardsWithAI({
      topic,
      examType,
      difficulty,
      count,
      includeCurrentAffairs
    });

    // Save generation request to analytics
    await supabase
      .from('ai_requests')
      .insert({
        user_id: user.id,
        request_type: 'flashcard_generation',
        request_data: body,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}

async function generateFlashcardsWithAI(params: FlashcardRequest) {
  // This would integrate with your HRM service or OpenAI
  // For now, returning mock data
  const mockFlashcards = Array.from({ length: params.count }, (_, index) => ({
    id: `card-${index + 1}`,
    question: `What is the significance of ${params.topic} in ${params.examType} preparation? (Question ${index + 1})`,
    answer: `${params.topic} is crucial for ${params.examType} as it forms the foundation of understanding key concepts. This topic requires systematic study and regular revision for optimal retention.`,
    difficulty: params.difficulty === 'mixed' 
      ? ['easy', 'medium', 'hard'][index % 3] as 'easy' | 'medium' | 'hard'
      : params.difficulty,
    topic: params.topic,
    subtopic: `Subtopic ${index + 1}`,
    examRelevance: Math.floor(Math.random() * 3) + 8 // 8-10 range
  }));

  return mockFlashcards;
}

// app/api/ai/analyze-current-affairs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: 'Please provide a substantial news article (minimum 100 characters)' },
        { status: 400 }
      );
    }

    // Mock analysis - replace with actual AI integration
    const analysis = {
      relevanceScore: Math.floor(Math.random() * 3) + 7, // 7-10
      keyPoints: [
        "Important policy implications for governance",
        "Constitutional significance and judicial precedents",
        "Economic impact and fiscal considerations",
        "International relations and diplomatic aspects"
      ],
      relatedTopics: [
        "Indian Polity",
        "Current Affairs",
        "Government Schemes",
        "International Relations",
        "Economic Survey"
      ],
      examQuestions: [
        "Analyze the constitutional validity of the policy discussed.",
        "Examine the economic implications of this development.",
        "Discuss the role of institutions mentioned in this context."
      ]
    };

    // Log the analysis request
    await supabase
      .from('ai_requests')
      .insert({
        user_id: user.id,
        request_type: 'current_affairs_analysis',
        request_data: { textLength: text.length },
        created_at: new Date().toISOString()
      });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing current affairs:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

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

function calculateStudyStreak(sessions: any[]):

function calculateKnowledgeScore(sessions: any[], Request: any[]) {
    throw new Error('Function not implemented.');
}


function getTopTopics(requests: any[]) {
    throw new Error('Function not implemented.');
}
function calculateKnowledgeScore(sessions: any[], requests: any[], Request: { new(input: RequestInfo | URL, init?: RequestInit): Request; prototype: Request; }, : any) {
    throw new Error('Function not implemented.');
}

