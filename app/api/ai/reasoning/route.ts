import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { question, context, examType } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Create a system prompt optimized for Indian competitive exams
    const systemPrompt = `You are an expert tutor for Indian competitive exams (UPSC, SSC, Banking, Railway). 
    Analyze the given question using advanced reasoning techniques similar to Hermann Ebbinghaus spaced repetition principles.
    
    For each question:
    1. Provide step-by-step reasoning
    2. Identify key concepts for spaced repetition
    3. Suggest related topics to review
    4. Rate difficulty level (1-10)
    5. Provide memory techniques if applicable
    
    Exam Type: ${examType || 'General'}
    Context: ${context || 'No additional context'}
    
    Respond in a structured JSON format with reasoning, concepts, relatedTopics, difficulty, and memoryTechniques.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" for cost efficiency
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    try {
      // Try to parse as JSON, fallback to plain text if it fails
      const parsedResponse = JSON.parse(aiResponse || '{}');
      return NextResponse.json({
        success: true,
        data: parsedResponse,
        rawResponse: aiResponse
      });
    } catch (parseError) {
      // If not valid JSON, return as plain text with structure
      return NextResponse.json({
        success: true,
        data: {
          reasoning: aiResponse,
          concepts: [],
          relatedTopics: [],
          difficulty: 5,
          memoryTechniques: []
        },
        rawResponse: aiResponse
      });
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process reasoning request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'OpenAI Reasoning Service Active',
    timestamp: new Date().toISOString()
  });
}