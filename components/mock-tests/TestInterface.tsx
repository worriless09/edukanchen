// components/mock-tests/TestInterface.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { MockTest, TestQuestion, TestAttempt } from '@/types/test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, AlertCircle, CheckCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TestInterfaceProps {
  testId: string;
  onTestComplete: (attempt: TestAttempt) => void;
  onExit?: () => void;
}

export default function TestInterface({ testId, onTestComplete, onExit }: TestInterfaceProps) {
  const [test, setTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  const { user, hasAccess } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Fetch test data
  useEffect(() => {
    fetchTestData();
  }, [testId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && test && !isSubmitting) {
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, test, warningShown, isSubmitting]);

  const fetchTestData = async () => {
    try {
      setLoading(true);

      // Fetch test details
      const { data: testData, error: testError } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) throw testError;
      
      if (!testData) {
        throw new Error('Test not found');
      }

      setTest(testData);

      // Check user access
      if (!user) {
        throw new Error('Please log in to access this test');
      }

      if (!hasAccess(testData.tier)) {
        throw new Error('Premium subscription required for this test');
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('test_questions')
        .select('*')
        .eq('mock_test_id', testId)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;
      
      const validQuestions = questionsData?.filter(q => q.question && q.options) || [];
      setQuestions(validQuestions);

      // Start timer
      if (testData.time_limit && testData.time_limit > 0) {
        setTimeRemaining(testData.time_limit * 60); // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      // Handle error appropriately - could show error message to user
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = useCallback((questionId: string, selectedAnswer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  }, []);

  const calculateScore = useCallback(() => {
    let score = 0;
    let totalMarks = 0;

    questions.forEach(question => {
      totalMarks += question.marks || 1;
      if (answers[question.id] === question.correct_answer) {
        score += question.marks || 1;
      }
    });

    return { score, totalMarks };
  }, [questions, answers]);

  const handleSubmit = async (autoSubmit = false) => {
    if (!user || !test || isSubmitting) return;

    // Clear timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

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
        completed_at: new Date().toISOString(),
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

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading test...</span>
      </div>
    );
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-gray-600 mb-4">
            Please log in to access this test.
          </p>
          <div className="space-x-2">
            {onExit && (
              <Button variant="outline" onClick={onExit}>
                Go Back
              </Button>
            )}
            <Button>Log In</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if test data is not available
  if (!test) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Test Not Found</h3>
          <p className="text-gray-600 mb-4">
            The requested test could not be found or loaded.
          </p>
          {onExit && (
            <Button variant="outline" onClick={onExit}>
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Check if user has access to the test tier
  if (!hasAccess(test.tier)) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Premium Required</h3>
          <p className="text-gray-600 mb-4">
            This test requires a premium subscription.
          </p>
          <div className="space-x-2">
            {onExit && (
              <Button variant="outline" onClick={onExit}>
                Go Back
              </Button>
            )}
            <Button>Upgrade to Premium</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
          <p className="text-gray-600 mb-4">
            This test doesn't have any questions yet.
          </p>
          {onExit && (
            <Button variant="outline" onClick={onExit}>
              Go Back
            </Button>
          )}
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
              <CardTitle className="text-xl">{test.title}</CardTitle>
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
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Answered: {answeredCount} / {questions.length}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
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
                {currentQuestion.marks || 1} mark{(currentQuestion.marks || 1) !== 1 ? 's' : ''}
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
              {currentQuestion.options && typeof currentQuestion.options === 'object' && 
                Object.entries(currentQuestion.options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                  <RadioGroupItem value={key} id={`${currentQuestion.id}-${key}`} />
                  <Label 
                    htmlFor={`${currentQuestion.id}-${key}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium mr-2">({key})</span>
                    {String(value)}
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
                onClick={() => navigateToQuestion(index)}
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
          
          <div className="flex justify-center gap-4">
            {onExit && (
              <Button variant="outline" onClick={onExit} disabled={isSubmitting}>
                Exit Test
              </Button>
            )}
            <Button
              onClick={() => setShowSubmitDialog(true)}
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

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? This action cannot be undone.
              {answeredCount < questions.length && (
                <div className="mt-2 text-yellow-600">
                  Warning: You have {questions.length - answeredCount} unanswered questions.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowSubmitDialog(false);
              handleSubmit();
            }}>
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}