// 5. API Route for Content Generation (app/api/generate-content/route.ts)
import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { topic, examType, difficulty, questionCount } = await request.json();

    const prompt = `
    Generate ${questionCount} multiple choice questions for ${examType} exam preparation.
    
    Topic: ${topic}
    Difficulty: ${difficulty}
    
    Requirements:
    - Questions should be exam-relevant and high-quality
    - Include 4 options (A, B, C, D) with only one correct answer
    - Provide detailed explanations for correct answers
    - Include memory techniques or mnemonics where helpful
    - Format as JSON array
    
    JSON Format:
    [
      {
        "question": "string",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctAnswer": "A" | "B" | "C" | "D",
        "explanation": "string",
        "mnemonic": "string (optional)",
        "tags": ["tag1", "tag2"],
        "difficulty": "easy" | "medium" | "hard"
      }
    ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const contentText = response.choices[0]?.message?.content;
    if (!contentText) {
      throw new Error('No response from OpenAI');
    }

    const questions = JSON.parse(contentText);
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('OpenAI Content Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}