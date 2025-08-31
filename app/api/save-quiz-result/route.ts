import { NextRequest, NextResponse } from 'next/server'

interface QuizResult {
  quizId: string
  userId: string
  answers: {
    questionId: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    timeTaken: number
  }[]
  totalScore: number
  percentage: number
  timeTaken: number
  completedAt: string
  examType: string
  subject?: string
}

interface QuizAnalytics {
  strongAreas: string[]
  weakAreas: string[]
  improvementSuggestions: string[]
  nextStudyTopics: string[]
  difficultyBreakdown: {
    easy: { correct: number; total: number }
    medium: { correct: number; total: number }
    hard: { correct: number; total: number }
  }
}

export async function POST(request: NextRequest) {
  try {
    const quizResult: QuizResult = await request.json()

    // Validate result data
    if (!quizResult.quizId || !quizResult.answers || quizResult.answers.length === 0) {
      return NextResponse.json({ error: 'Invalid quiz result data' }, { status: 400 })
    }

    // Save to database (mock implementation)
    const savedResult = await saveQuizResult(quizResult)

    // Generate analytics
    const analytics = generateQuizAnalytics(quizResult)

    // Update user progress and spaced repetition
    await updateUserProgress(quizResult.userId, quizResult)

    return NextResponse.json({
      success: true,
      resultId: savedResult.id,
      analytics,
      nextRecommendations: analytics.nextStudyTopics
    })

  } catch (error) {
    console.error('Save quiz result error:', error)
    return NextResponse.json({ error: 'Failed to save quiz result' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const quizId = searchParams.get('quizId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const results = await getUserQuizResults(userId, quizId)

    return NextResponse.json({ results })

  } catch (error) {
    console.error('Get quiz results error:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz results' }, { status: 500 })
  }
}

async function saveQuizResult(result: QuizResult) {
  // Mock save - replace with actual database save
  const savedResult = {
    id: `result_${Date.now()}`,
    ...result,
    savedAt: new Date().toISOString()
  }

  console.log('Quiz result saved:', savedResult.id)
  
  // In production, save to database:
  // await db.quizResults.create({ data: savedResult })
  
  return savedResult
}

function generateQuizAnalytics(result: QuizResult): QuizAnalytics {
  const correctAnswers = result.answers.filter(a => a.isCorrect)
  const wrongAnswers = result.answers.filter(a => !a.isCorrect)

  // Mock analytics generation
  const analytics: QuizAnalytics = {
    strongAreas: [
      'Constitutional Law',
      'Current Affairs',
      'Indian Geography'
    ],
    weakAreas: [
      'Economic Survey',
      'International Relations',
      'Science & Technology'
    ],
    improvementSuggestions: [
      'Focus more on economic concepts and terminologies',
      'Read newspaper editorials daily for current affairs',
      'Practice more questions on weak topics',
      'Create mind maps for complex topics'
    ],
    nextStudyTopics: [
      'Union Budget 2024',
      'India-China Border Relations',
      'Space Technology Developments',
      'Climate Change Policies'
    ],
    difficultyBreakdown: {
      easy: { correct: Math.floor(correctAnswers.length * 0.4), total: Math.floor(result.answers.length * 0.3) },
      medium: { correct: Math.floor(correctAnswers.length * 0.4), total: Math.floor(result.answers.length * 0.5) },
      hard: { correct: Math.floor(correctAnswers.length * 0.2), total: Math.floor(result.answers.length * 0.2) }
    }
  }

  return analytics
}

async function updateUserProgress(userId: string, result: QuizResult) {
  // Mock user progress update
  console.log(`Updated progress for user ${userId}`)
  
  // In production, update user statistics:
  // await db.users.update({
  //   where: { id: userId },
  //   data: {
  //     totalQuizzes: { increment: 1 },
  //     totalScore: { increment: result.totalScore },
  //     averageScore: /* calculate new average */,
  //     lastActivity: new Date()
  //   }
  // })
}

async function getUserQuizResults(userId: string, quizId?: string | null) {
  // Mock results fetch
  const mockResults = [
    {
      id: 'result_1',
      quizId: 'quiz_upsc_1',
      score: 85,
      percentage: 85,
      completedAt: '2024-08-25T10:00:00Z',
      examType: 'UPSC'
    },
    {
      id: 'result_2', 
      quizId: 'quiz_ssc_1',
      score: 78,
      percentage: 78,
      completedAt: '2024-08-24T15:30:00Z',
      examType: 'SSC'
    }
  ]

  if (quizId) {
    return mockResults.filter(r => r.quizId === quizId)
  }

  return mockResults
}
