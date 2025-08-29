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

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  subtopic: string;
  examRelevance: number;
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

    // Validate request parameters
    if (!topic || !examType || count < 1 || count > 50) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Generate flashcards using AI service
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
        response_count: flashcards.length,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ 
      flashcards,
      generated_at: new Date().toISOString(),
      count: flashcards.length
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}

async function generateFlashcardsWithAI(params: FlashcardRequest): Promise<Flashcard[]> {
  // TODO: Integrate with OpenAI API or other AI service
  // For now, using intelligent mock data generation
  
  const difficultyLevels: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  const questionTemplates = getQuestionTemplates(params.examType);
  
  const flashcards: Flashcard[] = Array.from({ length: params.count }, (_, index) => {
    const cardDifficulty = params.difficulty === 'mixed' 
      ? difficultyLevels[index % 3]
      : params.difficulty;
    
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    
    return {
      id: `card-${Date.now()}-${index + 1}`,
      question: template.question.replace('{topic}', params.topic),
      answer: template.answer.replace('{topic}', params.topic).replace('{examType}', params.examType),
      difficulty: cardDifficulty,
      topic: params.topic,
      subtopic: `${params.topic} - Concept ${index + 1}`,
      examRelevance: getDifficultyScore(cardDifficulty)
    };
  });

  return flashcards;
}

function getQuestionTemplates(examType: string) {
  const templates = {
    UPSC: [
      {
        question: "Analyze the significance of {topic} in the context of Indian governance and administration.",
        answer: "{topic} plays a crucial role in {examType} preparation as it forms the foundation of understanding Indian administrative systems and governance structures."
      },
      {
        question: "Discuss the historical evolution and current relevance of {topic}.",
        answer: "The historical development of {topic} shows its continued importance in modern Indian context, making it essential for {examType} aspirants."
      },
      {
        question: "What are the key challenges and opportunities related to {topic}?",
        answer: "{topic} presents both challenges and opportunities in the current socio-economic scenario, requiring comprehensive understanding for {examType} success."
      }
    ],
    SSC: [
      {
        question: "What is the basic definition and importance of {topic}?",
        answer: "{topic} is fundamental for {examType} preparation as it covers essential concepts required for competitive examinations."
      },
      {
        question: "List the main features and characteristics of {topic}.",
        answer: "The key features of {topic} include comprehensive coverage of topics relevant to {examType} syllabus and examination pattern."
      }
    ],
    Banking: [
      {
        question: "How does {topic} relate to banking operations and financial systems?",
        answer: "{topic} is crucial in banking sector understanding, covering essential financial concepts needed for {examType} examinations."
      },
      {
        question: "What are the regulatory aspects and compliance requirements related to {topic}?",
        answer: "Understanding {topic} helps in grasping regulatory frameworks essential for {examType} banking examinations."
      }
    ],
    Railway: [
      {
        question: "Explain the technical and operational aspects of {topic} in railway systems.",
        answer: "{topic} covers important technical concepts essential for {examType} railway examination preparation."
      },
      {
        question: "What is the role of {topic} in railway infrastructure and management?",
        answer: "{topic} plays a vital role in understanding railway operations and management, crucial for {examType} success."
      }
    ]
  };

  return templates[examType as keyof typeof templates] || templates.SSC;
}

function getDifficultyScore(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy': return Math.floor(Math.random() * 2) + 6; // 6-7
    case 'medium': return Math.floor(Math.random() * 2) + 8; // 8-9
    case 'hard': return 10; // 10
    default: return 8;
  }
}