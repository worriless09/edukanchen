// 6. API Routes Implementation
// app/api/labs/generate-flashcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { topic, examType, difficulty, count = 10 } = await request.json();
    
    if (!topic?.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      );
    }

    // Call your HRM service
    const hrmResponse = await fetch(`${process.env.HRM_SERVICE_URL}/generate-flashcards`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HRM_API_KEY}`
      },
      body: JSON.stringify({
        topic,
        examType,
        difficulty,
        count,
        language: 'english' // Add Hindi support later
      })
    });
    
    if (!hrmResponse.ok) {
      throw new Error('HRM service error');
    }
    
    const hrmData = await hrmResponse.json();
    
    // Structure flashcards with proper IDs and metadata
    const flashcards = hrmData.flashcards.map((card: any, index: number) => ({
      id: crypto.randomUUID(),
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || difficulty,
      topic: topic,
      subtopic: card.subtopic,
      examType: examType,
      order: index,
      createdAt: new Date().toISOString(),
      // Spaced repetition data
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: new Date().toISOString()
    }));
    
    // Log generation event
    await supabase
      .from('lab_analytics')
      .insert({
        lab_id: 'flashcard-generator',
        event_type: 'flashcards_generated',
        event_data: {
          topic,
          examType,
          difficulty,
          count: flashcards.length
        }
      });
    
    return NextResponse.json({ 
      success: true, 
      flashcards,
      metadata: {
        topic,
        examType,
        difficulty,
        count: flashcards.length,
        estimatedStudyTime: flashcards.length * 2 // 2 minutes per card
      }
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards. Please try again.' }, 
      { status: 500 }
    );
  }
}