// components/mock-tests/TestResult.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TestAttempt, TestQuestion } from '@/types/test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Target, Award, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface TestResultProps {
  attempt: TestAttempt;
  onRetakeTest: () => void;
}

export default function TestResult({ attempt, onRetakeTest }: TestResultProps) {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchQuestions();
  }, [attempt.mock_test_id]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('test_questions')
        .select('*')
        .eq('mock_test_id', attempt.mock_test_id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const grade = getGrade(attempt.percentage);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading results...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader className="text-center">
          <div className={`w-24 h-24 rounded-full ${grade.bg} flex items-center justify-center mx-auto mb-4`}>
            <span className={`text-3xl font-bold ${grade.color}`}>{grade.grade}</span>
          </div>
          <CardTitle className="text-2xl">Test Completed!</CardTitle>
          <p className="text-gray-600">Here are your results</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{attempt.score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-600">{attempt.percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                <Clock className="h-5 w-5 inline mr-1" />
                {formatTime(attempt.time_taken)}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {attempt.rank || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Rank</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Performance</span>
              <span>{attempt.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={attempt.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : userAnswer ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium">
                      Q{index + 1}. {question.question}
                    </h4>
                    <div className="flex items-center ml-4">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : userAnswer ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <div className="w-5 h-5 bg-gray-400 rounded-full" />
                      )}
                      <Badge variant="outline" className="ml-2">
                        {question.marks} mark{question.marks !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div 
                        key={key}
                        className={`p-2 rounded ${
                          key === question.correct_answer 
                            ? 'bg-green-100 text-green-800 font-medium' 
                            : key === userAnswer && userAnswer !== question.correct_answer
                            ? 'bg-red-100 text-red-800'
                            : 'bg-white'
                        }`}
                      >
                        <span className="font-medium">({key})</span> {value}
                        {key === question.correct_answer && (
                          <span className="ml-2 text-green-600">✓ Correct Answer</span>
                        )}
                        {key === userAnswer && userAnswer !== question.correct_answer && (
                          <span className="ml-2 text-red-600">✗ Your Answer</span>
                        )}
                      </div>
                    ))}
                    
                    {!userAnswer && (
                      <div className="text-gray-500 italic">Not attempted</div>
                    )}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <h5 className="font-medium text-blue-800 mb-1">Explanation:</h5>
                      <p className="text-blue-700 text-sm">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const subjectStats = questions.reduce((acc, question) => {
              const subject = question.subject || 'General';
              if (!acc[subject]) {
                acc[subject] = { total: 0, correct: 0, marks: 0, maxMarks: 0 };
              }
              
              acc[subject].total += 1;
              acc[subject].maxMarks += question.marks;
              
              if (attempt.answers[question.id] === question.correct_answer) {
                acc[subject].correct += 1;
                acc[subject].marks += question.marks;
              }
              
              return acc;
            }, {} as Record<string, any>);

            return (
              <div className="space-y-4">
                {Object.entries(subjectStats).map(([subject, stats]) => {
                  const percentage = stats.maxMarks > 0 ? (stats.marks / stats.maxMarks) * 100 : 0;
                  
                  return (
                    <div key={subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject}</span>
                        <span className="text-sm text-gray-600">
                          {stats.correct}/{stats.total} questions ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center space-x-4">
            <Button onClick={onRetakeTest} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Test
            </Button>
            
            <Link href="/dashboard">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
