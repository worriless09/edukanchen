
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
