// 9. MOCK TEST SYSTEM
// ========================================

// components/mock-tests/TestInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { MockTest, TestQuestion, TestAttempt } from '@/types/test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface TestInterfaceProps {
  testId: string;
  onTestComplete: (attempt: TestAttempt) => void;
}

export default function TestInterface({ testId, onTestComplete }: TestInterfaceProps) {
  const [test, setTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warningShown, setWarningShown] = useState(false);
  const { user, hasAccess } = useAuth();
  const timerRef = useRef<NodeJS.Timeout>();
  const supabase = createClient();

  useEffect(() => {
    fetchTestData();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [testId]);

  useEffect(() => {
    if (timeRemaining > 0 && test) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit(true); // Auto-submit when time runs out
            return 0;
          }
          
          // Show warning at 5 minutes remaining
          if (prev === 300 && !warningShown) {
            setWarningShown(true);
            alert('5 minutes remaining!');
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeRemaining, test, warningShown]);

  const fetchTestData = async () => {
    try {
      // Fetch test details
      const { data: testData, error: testError } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) throw testError;
      setTest(testData);

      // Check access
      if (!hasAccess(testData.tier)) {
        throw new Error('Premium subscription required');
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('test_questions')
        .select('*')
        .eq('mock_test_id', testId)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Start timer
      setTimeRemaining(testData.time_limit * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, selectedAnswer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const calculateScore = () => {
    let score = 0;
    let totalMarks = 0;

    questions.forEach(question => {
      totalMarks += question.marks;
      if (answers[question.id] === question.correct_answer) {
        score += question.marks;
      }
    });

    return { score, totalMarks };
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!user || !test || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { score, totalMarks } = calculateScore();
      const timeTaken = (test.time_limit * 60) - timeRemaining;
      const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

      const attemptData = {
        user_id: user.id,
        mock_test_id: testId,
        answers: answers,
        score,
        total_marks: totalMarks,
        time_taken: timeTaken,
        percentage: Math.round(percentage * 100) / 100,
      };

      const { data: attempt, error } = await supabase
        .from('user_test_attempts')
        .insert(attemptData)
        .select()
        .single();

      if (error) throw error;

      onTestComplete(attempt);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // Less than 5 minutes
    if (timeRemaining <= 600) return 'text-orange-600'; // Less than 10 minutes
    return 'text-green-600';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading test...</div>;
  }

  if (!test || !hasAccess(test.tier)) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-gray-600 mb-4">
            This test requires a premium subscription.
          </p>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{test.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getTimeColor()}`}>
                <Clock className="h-5 w-5 inline mr-2" />
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-600">Time Remaining</p>
            </div>
          </div>
          
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Answered: {answeredCount} / {questions.length}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                Q{currentQuestionIndex + 1}. {currentQuestion.question}
              </CardTitle>
              <Badge variant="secondary">
                {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {currentQuestion.subject && (
              <Badge variant="outline" className="w-fit">
                {currentQuestion.subject}
              </Badge>
            )}
          </CardHeader>
          
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            >
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                  <RadioGroupItem value={key} id={`${currentQuestion.id}-${key}`} />
                  <Label 
                    htmlFor={`${currentQuestion.id}-${key}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium mr-2">({key})</span>
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestionIndex === index ? "default" : "outline"}
                size="sm"
                className={`w-10 h-10 p-0 ${
                  answers[questions[index]?.id] 
                    ? (currentQuestionIndex === index ? 'bg-green-600 hover:bg-green-700' : 'border-green-500 text-green-600')
                    : ''
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {answers[questions[index]?.id] && currentQuestionIndex !== index && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {(!answers[questions[index]?.id] || currentQuestionIndex === index) && (index + 1)}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-center mt-6 space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div>
              Not Answered
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-green-500 rounded mr-2"></div>
              Answered
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
              Current
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardContent className="p-6">
          {answeredCount < questions.length && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have {questions.length - answeredCount} unanswered questions.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              size="lg"
              className="px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
