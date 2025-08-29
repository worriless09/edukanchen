// app/api/ai/analyze-current-affairs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface CurrentAffairsAnalysis {
  relevanceScore: number; // 1-10 scale
  keyPoints: string[];
  relatedTopics: string[];
  examQuestions: string[];
  examRelevance: {
    UPSC: number;
    SSC: number;
    Banking: number;
    Railway: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  studyTime: number; // estimated minutes to understand
  tags: string[];
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
    const { text, examType } = body;

    // Validation
    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: 'Please provide a substantial news article (minimum 100 characters)' },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Article too long. Please provide text under 10,000 characters' },
        { status: 400 }
      );
    }

    // Analyze current affairs content
    const analysis = await analyzeCurrentAffairs(text, examType);

    // Log the analysis request
    await supabase
      .from('ai_requests')
      .insert({
        user_id: user.id,
        request_type: 'current_affairs_analysis',
        request_data: { 
          textLength: text.length,
          examType: examType || 'general',
          relevanceScore: analysis.relevanceScore
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      analysis,
      processed_at: new Date().toISOString(),
      word_count: text.split(' ').length
    });

  } catch (error) {
    console.error('Error analyzing current affairs:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

async function analyzeCurrentAffairs(
  text: string, 
  examType?: string
): Promise<CurrentAffairsAnalysis> {
  // TODO: Replace with actual AI service integration (OpenAI/Gemini)
  
  // Intelligent mock analysis based on content
  const wordCount = text.split(' ').length;
  const difficulty = getDifficultyFromText(text);
  const topics = extractTopicsFromText(text);
  const relevanceScore = calculateRelevanceScore(text, topics);
  
  const analysis: CurrentAffairsAnalysis = {
    relevanceScore,
    keyPoints: generateKeyPoints(text, topics, difficulty),
    relatedTopics: topics,
    examQuestions: generateExamQuestions(topics, examType, difficulty),
    examRelevance: calculateExamRelevance(topics, text),
    difficulty,
    studyTime: Math.max(5, Math.min(60, Math.ceil(wordCount / 100))), // 5-60 minutes
    tags: generateTags(text, topics)
  };

  return analysis;
}

function getDifficultyFromText(text: string): 'easy' | 'medium' | 'hard' {
  const complexWords = ['constitutional', 'parliamentary', 'judicial', 'fiscal', 'monetary', 'geopolitical'];
  const complexCount = complexWords.filter(word => 
    text.toLowerCase().includes(word)
  ).length;
  
  if (complexCount >= 3) return 'hard';
  if (complexCount >= 1) return 'medium';
  return 'easy';
}

function extractTopicsFromText(text: string): string[] {
  const topicKeywords = {
    'Indian Polity': ['constitution', 'parliament', 'judicial', 'executive', 'legislature', 'federalism'],
    'Economics': ['fiscal', 'monetary', 'GDP', 'inflation', 'budget', 'economy', 'financial'],
    'International Relations': ['foreign policy', 'bilateral', 'diplomacy', 'trade', 'agreement', 'treaty'],
    'Current Affairs': ['policy', 'scheme', 'government', 'ministry', 'announcement'],
    'Geography': ['climate', 'environment', 'natural', 'resources', 'geography', 'disaster'],
    'History': ['historical', 'heritage', 'culture', 'tradition', 'ancient', 'medieval'],
    'Science & Technology': ['technology', 'innovation', 'research', 'scientific', 'digital', 'cyber'],
    'Social Issues': ['society', 'education', 'health', 'welfare', 'gender', 'inequality']
  };

  const identifiedTopics: string[] = [];
  const lowerText = text.toLowerCase();

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matchCount >= 1) {
      identifiedTopics.push(topic);
    }
  });

  return identifiedTopics.length > 0 ? identifiedTopics.slice(0, 5) : ['Current Affairs'];
}

function generateKeyPoints(text: string, topics: string[], difficulty: string): string[] {
  const basePoints = [
    "Significant policy development with constitutional implications",
    "Important for understanding current governance trends",
    "Relevant for multiple exam subjects and question patterns",
    "Connects to broader themes in Indian administration"
  ];

  // Customize based on identified topics
  if (topics.includes('Economics')) {
    basePoints.push("Economic policy implications for fiscal management");
  }
  if (topics.includes('International Relations')) {
    basePoints.push("Strategic importance in India's foreign policy framework");
  }
  if (topics.includes('Indian Polity')) {
    basePoints.push("Constitutional and legal framework considerations");
  }

  return basePoints.slice(0, 4);
}

function generateExamQuestions(topics: string[], examType?: string, difficulty?: string): string[] {
  const questionTemplates = {
    UPSC: [
      "Critically analyze the implications of this development for Indian governance.",
      "Examine the constitutional and legal dimensions of this issue.",
      "Discuss the policy framework and implementation challenges involved."
    ],
    SSC: [
      "What are the main features of this development?",
      "Explain the significance of this event for India.",
      "List the key stakeholders involved in this matter."
    ],
    Banking: [
      "How does this development affect the banking and financial sector?",
      "What are the regulatory implications for financial institutions?",
      "Analyze the economic impact of this policy change."
    ],
    Railway: [
      "What are the infrastructure and operational implications?",
      "How does this affect transportation and logistics?",
      "Discuss the technological aspects of this development."
    ]
  };

  const defaultQuestions = [
    "What is the significance of this development?",
    "Analyze the key implications for India.",
    "Discuss the challenges and opportunities presented."
  ];

  return questionTemplates[examType as keyof typeof questionTemplates] || defaultQuestions;
}

function calculateExamRelevance(topics: string[], text: string) {
  const baseRelevance = { UPSC: 7, SSC: 6, Banking: 5, Railway: 4 };
  
  // Boost relevance based on topics
  if (topics.includes('Indian Polity')) {
    baseRelevance.UPSC += 2;
    baseRelevance.SSC += 1;
  }
  if (topics.includes('Economics')) {
    baseRelevance.Banking += 3;
    baseRelevance.UPSC += 1;
  }
  if (topics.includes('Current Affairs')) {
    baseRelevance.UPSC += 1;
    baseRelevance.SSC += 2;
  }

  // Cap at 10
  Object.keys(baseRelevance).forEach(exam => {
    baseRelevance[exam as keyof typeof baseRelevance] = Math.min(10, baseRelevance[exam as keyof typeof baseRelevance]);
  });

  return baseRelevance;
}

function calculateRelevanceScore(text: string, topics: string[]): number {
  let score = 5; // base score
  
  // Boost for multiple relevant topics
  score += Math.min(3, topics.length);
  
  // Boost for government/policy keywords
  const importantKeywords = ['government', 'policy', 'minister', 'parliament', 'supreme court'];
  const keywordMatches = importantKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  score += Math.min(2, keywordMatches);
  
  return Math.min(10, score);
}

function generateTags(text: string, topics: string[]): string[] {
  const tags = [...topics];
  
  // Add specific tags based on content
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('government') || lowerText.includes('ministry')) {
    tags.push('Government Policy');
  }
  if (lowerText.includes('supreme court') || lowerText.includes('judicial')) {
    tags.push('Judiciary');
  }
  if (lowerText.includes('parliament') || lowerText.includes('lok sabha')) {
    tags.push('Legislature');
  }
  if (lowerText.includes('budget') || lowerText.includes('economic')) {
    tags.push('Economic Affairs');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}