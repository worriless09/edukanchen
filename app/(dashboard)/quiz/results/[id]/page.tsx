'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface QuestionResult {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  user_answer: number;
  explanation?: string;
  is_correct: boolean;
}

interface QuizResult {
  id: string;
  quiz_id: string;
  quiz_title: string;
  quiz_category?: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_minutes: number;
  completed_at: string;
  answers: Record<string, number>;
  questions: QuestionResult[];
  percentile?: number;
  rank?: number;
}

interface QuizResultsPageProps {
  params: { id: string };
}

export default function QuizResultsPage({ params }: QuizResultsPageProps) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchResultData();
  }, [params.id, user]);

  const fetchResultData = async () => {
    try {
      // Fetch quiz attempt result
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (
            id,
            title,
            category,
            quiz_questions (
              id,
              question,
              options,
              correct_answer,
              explanation,
              order_index
            )
          )
        `)
        .eq('id', params.id)
        .eq('user_id', user?.id)
        .single();

      if (attemptError) throw attemptError;

      if (!attemptData) {
        throw new Error('Quiz result not found');
      }

      // Transform the data
      const quiz = attemptData.quizzes;
      const questions = quiz.quiz_questions
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((q: any) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          user_answer: attemptData.answers[q.id] ?? -1,
          explanation: q.explanation,
          is_correct: attemptData.answers[q.id] === q.correct_answer,
        }));

      const correctAnswers = questions.filter((q: QuestionResult) => q.is_correct).length;

      // Calculate additional stats (mock data for now - in real app, fetch from leaderboard)
      const percentile = Math.min(95, Math.max(5, attemptData.score + Math.random() * 10));
      const rank = Math.floor(Math.random() * 1000) + 1;

      const transformedResult: QuizResult = {
        id: attemptData.id,
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        quiz_category: quiz.category,
        score: attemptData.score,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        time_taken_minutes: Math.floor((new Date(attemptData.completed_at).getTime() - new Date(attemptData.created_at).getTime()) / (1000 * 60)),
        completed_at: attemptData.completed_at,
        answers: attemptData.answers,
        questions,
        percentile: Math.round(percentile),
        rank,
      };

      setResult(transformedResult);
    } catch (error) {
      console.error('Error fetching quiz result:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! Outstanding performance! 🎉';
    if (score >= 80) return 'Great job! You did really well! 👏';
    if (score >= 70) return 'Good work! Room for improvement. 👍';
    if (score >= 60) return 'Not bad! Keep practicing. 📚';
    return 'Keep studying and try again! 💪';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Results Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The quiz results you're looking for don't exist or you don't have permission to view them.
            </p>
            <Button onClick={() => router.push('/quiz')}>Back to Quizzes</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Trophy className={`h-16 w-16 mx-auto ${getScoreColor(result.score)}`} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
          <p className="text-muted-foreground">{result.quiz_title}</p>
        </div>

        {/* Score Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                {Math.round(result.score)}%
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {getScoreMessage(result.score)}
              </p>
              <Progress 
                value={result.score} 
                className="h-3 mb-4" 
              />
              <div className="text-sm text-muted-foreground">
                {result.correct_answers} out of {result.total_questions} questions correct
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-semibold">{result.correct_answers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <XCircle className="h-6 w-6 mx-auto mb-2 text-destructive" />
                <div className="text-lg font-semibold">{result.total_questions - result.correct_answers}</div>
                <div className="text-sm text-muted-foreground">Wrong</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-lg font-semibold">{result.time_taken_minutes}m</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold">{result.percentile}%</div>
                <div className="text-sm text-muted-foreground">Percentile</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Performance</span>
                <Badge variant={result.score >= 70 ? "default" : "destructive"}>
                  {result.score >= 90 ? 'Excellent' : 
                   result.score >= 70 ? 'Good' : 
                   result.score >= 50 ? 'Average' : 'Needs Improvement'}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your Rank</span>
                  <span className="font-medium">#{result.rank} out of 1000+ participants</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Category</span>
                  <span className="font-medium">{result.quiz_category || 'General'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed At</span>
                  <span className="font-medium">
                    {new Date(result.completed_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setShowDetailedReview(!showDetailedReview)}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {showDetailedReview ? 'Hide' : 'Show'} Detailed Review
          </Button>
          
          <Link href={`/quiz/attempt/${result.quiz_id}`} className="flex-1 sm:flex-none">
            <Button className="w-full">
              Retake Quiz
            </Button>
          </Link>
          
          <Link href="/quiz" className="flex-1 sm:flex-none">
            <Button variant="secondary" className="w-full">
              Back to Quizzes
            </Button>
          </Link>
        </div>

        {/* Detailed Review */}
        {showDetailedReview && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {question.is_correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                optionIndex === question.correct_answer
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : optionIndex === question.user_answer && !question.is_correct
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-muted/50'
                              }`}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                              {optionIndex === question.correct_answer && (
                                <span className="ml-2 text-xs">(Correct Answer)</span>
                              )}
                              {optionIndex === question.user_answer && 
                               optionIndex !== question.correct_answer && (
                                <span className="ml-2 text-xs">(Your Answer)</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <h5 className="font-medium text-blue-900 mb-1">Explanation:</h5>
                            <p className="text-sm text-blue-800">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.score < 70 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">Focus on weak areas</p>
                    <p className="text-sm text-yellow-800">
                      Review the questions you got wrong and study related topics.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Continue Learning</p>
                  <p className="text-sm text-blue-800">
                    Practice more quizzes in this category to improve your understanding.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}