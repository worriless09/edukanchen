'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Brain, Upload, MessageSquare, CheckCircle, Clock, Trophy, Play, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Question {
  id: string
  text: string
  subject: string
  year: number
  examType: 'UPSC' | 'SSC' | 'Banking' | 'Railway'
  difficulty: number
  userAnswer?: string
  aiAnswer?: string
  explanation?: string
  confidence?: number
  options?: string[]
  correctAnswer?: string
  type: 'mcq' | 'descriptive'
}

interface QuizSession {
  id: string
  questions: Question[]
  currentQuestion: number
  score: number
  completed: boolean
  startTime: Date
  endTime?: Date
  answers: { [questionId: string]: string }
}

export function PYQQuizSystem() {
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)
  const [uploadedQuestions, setUploadedQuestions] = useState<Question[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedExam, setSelectedExam] = useState<'UPSC' | 'SSC' | 'Banking' | 'Railway'>('UPSC')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle question upload
  const handleQuestionUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files) {
      setIsProcessing(true)
      const file = files
      
      try {
        const content = await readFileContent(file)
        const questions = parseQuestionsFromContent(content, selectedExam)
        
        setUploadedQuestions(prev => [...prev, ...questions])
        
        toast({
          title: "Upload successful",
          description: `Parsed ${questions.length} questions from ${file.name}`,
        })
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to parse questions from file",
        })
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const parseQuestionsFromContent = (content: string, examType: typeof selectedExam): Question[] => {
    const lines = content.split('\n').filter(line => line.trim())
    const questions: Question[] = []
    
    let currentQuestion = ''
    let currentOptions: string[] = []
    let questionCounter = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (/^(\d+\.|\d+\)|\w\d+[:.]|\d+[:.])/i.test(line)) {
        if (currentQuestion) {
          questions.push(createQuestionFromText(currentQuestion, currentOptions, examType, questionCounter++))
          currentOptions = []
        }
        currentQuestion = line.replace(/^(\d+\.|\d+\)|\w\d+[:.]|\d+[:.])/i, '').trim()
      }
      else if (/^[a-d]\)|^\([a-d]\)|^[A-D]\)|^\([A-D]\)/i.test(line)) {
        currentOptions.push(line)
      }
      else if (currentQuestion && line) {
        currentQuestion += ' ' + line
      }
    }
    
    if (currentQuestion) {
      questions.push(createQuestionFromText(currentQuestion, currentOptions, examType, questionCounter))
    }
    
    return questions.filter(q => q.text.length > 10)
  }

  const createQuestionFromText = (text: string, options: string[], examType: typeof selectedExam, index: number): Question => {
    return {
      id: `q-${Date.now()}-${index}`,
      text: text.trim(),
      subject: detectSubject(text),
      year: new Date().getFullYear(),
      examType,
      difficulty: estimateDifficulty(text, options.length > 0),
      options: options.length > 0 ? options : undefined,
      type: options.length > 0 ? 'mcq' : 'descriptive'
    }
  }

  const detectSubject = (text: string): string => {
    const keywords = {
      'History': ['independence', 'freedom', 'british', 'colonial', 'ancient', 'medieval'],
      'Geography': ['climate', 'rainfall', 'mountain', 'river', 'plateau', 'monsoon'],
      'Polity': ['constitution', 'parliament', 'president', 'supreme court', 'fundamental rights'],
      'Economics': ['gdp', 'inflation', 'fiscal', 'monetary', 'budget', 'trade'],
      'Current Affairs': ['recent', '2024', '2023', 'latest', 'current', 'new policy'],
      'Science': ['technology', 'research', 'scientific', 'innovation', 'discovery']
    }

    const lowerText = text.toLowerCase()
    for (const [subject, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => lowerText.includes(keyword))) {
        return subject
      }
    }
    return 'General Studies'
  }

  const estimateDifficulty = (text: string, hasOptions: boolean): number => {
    let difficulty = 3
    if (text.length > 200) difficulty += 1
    if (text.length > 400) difficulty += 1
    if (hasOptions) difficulty -= 1
    return Math.max(1, Math.min(10, difficulty))
  }

  const startQuiz = (questions: Question[]) => {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
    
    const session: QuizSession = {
      id: Date.now().toString(),
      questions: shuffledQuestions.slice(0, 20), // Limit to 20 questions
      currentQuestion: 0,
      score: 0,
      completed: false,
      startTime: new Date(),
      answers: {}
    }
    setCurrentSession(session)
  }

  const submitAnswer = (answer: string) => {
    if (!currentSession) return
    
    const currentQ = currentSession.questions[currentSession.currentQuestion]
    const newAnswers = { ...currentSession.answers, [currentQ.id]: answer }
    
    const updatedSession: QuizSession = {
      ...currentSession,
      answers: newAnswers
    }
    
    if (currentSession.currentQuestion < currentSession.questions.length - 1) {
      updatedSession.currentQuestion++
    } else {
      updatedSession.completed = true
      updatedSession.endTime = new Date()
      updatedSession.score = Object.keys(newAnswers).length * 5 // Mock scoring
    }
    
    setCurrentSession(updatedSession)
  }

  const getAIAnswer = async (question: Question) => {
    try {
      const response = await fetch('/api/analyze-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.text,
          examType: question.examType,
          subject: question.subject
        })
      })
      
      if (response.ok) {
        const aiResponse = await response.json()
        
        const updatedQuestion: Question = {
          ...question,
          aiAnswer: aiResponse.reasoning,
          explanation: aiResponse.reasoning,
          confidence: 85
        }
        
        setUploadedQuestions(prev => prev.map(q => 
          q.id === question.id ? updatedQuestion : q
        ))

        toast({
          title: "AI Analysis Complete",
          description: "Generated detailed answer and explanation"
        })
      }
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: "Unable to generate AI answer"
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PYQ Quiz System with AI
        </h1>
        <p className="text-gray-600">
          Upload previous year questions and get AI-powered answers
        </p>
      </div>

      {/* Active Quiz Session */}
      {currentSession && !currentSession.completed && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quiz in Progress</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor((Date.now() - currentSession.startTime.getTime()) / 60000)}m
                </span>
                <Badge>
                  {currentSession.currentQuestion + 1} / {currentSession.questions.length}
                </Badge>
              </div>
            </CardTitle>
            <Progress 
              value={((currentSession.currentQuestion + 1) / currentSession.questions.length) * 100} 
              className="w-full"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{currentSession.questions[currentSession.currentQuestion]?.subject}</Badge>
                  <Badge variant="secondary">
                    {currentSession.questions[currentSession.currentQuestion]?.examType}
                  </Badge>
                </div>

                <h3 className="text-lg font-medium mb-4">
                  Q{currentSession.currentQuestion + 1}: {currentSession.questions[currentSession.currentQuestion]?.text}
                </h3>
                
                {/* MCQ Options */}
                {currentSession.questions[currentSession.currentQuestion]?.type === 'mcq' && 
                 currentSession.questions[currentSession.currentQuestion]?.options && (
                  <div className="space-y-2 mb-6">
                    {currentSession.questions[currentSession.currentQuestion].options!.map((option, index) => (
                      <div 
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => submitAnswer(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}

                {/* Descriptive Answer */}
                {currentSession.questions[currentSession.currentQuestion]?.type === 'descriptive' && (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Type your answer here..."
                      className="w-full p-3 border rounded-lg h-32 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          const answer = (e.target as HTMLTextAreaElement).value
                          if (answer.trim()) {
                            submitAnswer(answer.trim())
                            ;(e.target as HTMLTextAreaElement).value = ''
                          }
                        }
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Press Ctrl+Enter to submit</p>
                      <Button 
                        onClick={() => {
                          const textarea = document.querySelector('textarea') as HTMLTextAreaElement
                          if (textarea.value.trim()) {
                            submitAnswer(textarea.value.trim())
                            textarea.value = ''
                          }
                        }}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Completed */}
      {currentSession?.completed && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Quiz Completed!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {currentSession.questions.length}
                </div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {currentSession.score}
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {currentSession.endTime && 
                    Math.floor((currentSession.endTime.getTime() - currentSession.startTime.getTime()) / 60000)
                  }m
                </div>
                <div className="text-sm text-gray-500">Time Taken</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(currentSession.answers).length}
                </div>
                <div className="text-sm text-gray-500">Answered</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setCurrentSession(null)}>
                Start New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload PYQs</TabsTrigger>
          <TabsTrigger value="library">Question Bank ({uploadedQuestions.length})</TabsTrigger>
          <TabsTrigger value="practice">Practice Tests</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Exam Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                {(['UPSC', 'SSC', 'Banking', 'Railway'] as const).map(exam => (
                  <Button
                    key={exam}
                    variant={selectedExam === exam ? 'default' : 'outline'}
                    onClick={() => setSelectedExam(exam)}
                  >
                    {exam}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PYQ Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Upload question files
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports .txt files with questions and options
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleQuestionUpload}
                className="hidden"
              />
              {isProcessing && (
                <div className="flex items-center gap-2 text-blue-600 mt-4">
                  <div className="loading-spinner w-4 h-4" />
                  Processing uploaded questions...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Question Library */}
        <TabsContent value="library">
          {uploadedQuestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions uploaded yet</h3>
                <p className="text-gray-500">Upload some PYQ files to get started</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Question Bank ({uploadedQuestions.length})</CardTitle>
                <Button onClick={() => startQuiz(uploadedQuestions)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {uploadedQuestions.slice(0, 10).map(question => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium flex-1 pr-4">{question.text}</p>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge variant="secondary">{question.examType}</Badge>
                          <Badge variant="outline">{question.subject}</Badge>
                        </div>
                      </div>
                      
                      {question.aiAnswer ? (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">AI Answer</span>
                          </div>
                          <p className="text-green-700">{question.aiAnswer}</p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => getAIAnswer(question)}
                          className="mt-2 flex items-center gap-2"
                          variant="outline"
                        >
                          <Brain className="h-4 w-4" />
                          Get AI Answer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Practice Tests */}
        <TabsContent value="practice">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['History', 'Geography', 'Polity', 'Economics'].map(subject => {
                    const subjectQuestions = uploadedQuestions.filter(q => q.subject === subject)
                    return (
                      <div key={subject} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{subject}</h4>
                          <p className="text-sm text-gray-500">{subjectQuestions.length} questions</p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => startQuiz(subjectQuestions)}
                          disabled={subjectQuestions.length === 0}
                        >
                          Start Test
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Random 10 Questions</h4>
                    <p className="text-sm text-gray-500 mb-3">Mixed difficulty level</p>
                    <Button 
                      size="sm"
                      onClick={() => startQuiz(uploadedQuestions.slice(0, 10))}
                      disabled={uploadedQuestions.length < 10}
                      className="w-full"
                    >
                      Start Quick Test
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Full Length Test</h4>
                    <p className="text-sm text-gray-500 mb-3">20 questions, 30 minutes</p>
                    <Button 
                      size="sm"
                      onClick={() => startQuiz(uploadedQuestions)}
                      disabled={uploadedQuestions.length < 5}
                      className="w-full"
                    >
                      Start Full Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
