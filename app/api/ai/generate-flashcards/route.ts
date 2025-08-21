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