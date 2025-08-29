// 4. API Route for Spaced Repetition Analysis (app/api/analyze-question/route.ts)
import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer, difficulty, subject } = await request.json();

    const prompt = `
    You are an advanced educational AI for Indian competitive exams (UPSC, SSC, Banking).
    
    Analyze this question-answer pair using Hermann Ebbinghaus spaced repetition principles:
    
    Question: ${question}
    User Answer: ${userAnswer}
    Correct Answer: ${correctAnswer}
    Subject: ${subject}
    Difficulty: ${difficulty}
    
    Provide analysis in JSON format:
    {
      "isCorrect": boolean,
      "confidence": number (0-1),
      "nextReviewInterval": number (hours),
      "explanation": string,
      "keyPoints": string[],
      "mnemonics": string,
      "difficultyAssessment": "easy" | "medium" | "hard",
      "recommendations": string[]
    }
    
    Base the nextReviewInterval on Ebbinghaus forgetting curve:
    - Correct + High confidence: 24-168 hours
    - Correct + Low confidence: 4-24 hours  
    - Incorrect: 1-4 hours
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const analysisText = response.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const analysis = JSON.parse(analysisText);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze question' },
      { status: 500 }
    );
  }
}