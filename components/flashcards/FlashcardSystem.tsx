'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Brain, FileText, Zap, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { FlashcardCreator } from './FlashcardCreator'
import { useToast } from '@/components/ui/use-toast'

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  difficulty: number
  createdFrom: 'manual' | 'notes' | 'ai'
  concepts: string[]
  memoryTechnique?: string
  nextReview: Date
  reviewCount: number
  correctCount: number
}

interface NotesUpload {
  id: string
  file: File
  content: string
  flashcardsGenerated: number
  status: 'pending' | 'processing' | 'completed' | 'error'
}

export function FlashcardSystem() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [uploadedNotes, setUploadedNotes] = useState<NotesUpload[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreator, setShowCreator] = useState(false)
  const [studyMode, setStudyMode] = useState<'review' | 'learn'>('learn')
  const notesInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle notes upload
  const handleNotesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      if (file.type === 'text/plain' || file.type === 'application/pdf' || file.name.endsWith('.txt')) {
        try {
          const content = await readFileContent(file)
          const noteUpload: NotesUpload = {
            id: Date.now().toString() + Math.random(),
            file,
            content,
            flashcardsGenerated: 0,
            status: 'pending'
          }
          setUploadedNotes(prev => [...prev, noteUpload])
        } catch (error) {
          toast({
            title: "Upload failed",
            description: `Failed to read ${file.name}`,
            variant: "destructive"
          })
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload .txt or .pdf files only",
          variant: "destructive"
        })
      }
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (content.length < 100) {
          reject(new Error('File content too short (minimum 100 characters)'))
        } else {
          resolve(content)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  // Generate flashcards from notes using AI
  const generateFlashcardsFromNotes = async (notesId: string) => {
    const notes = uploadedNotes.find(n => n.id === notesId)
    if (!notes) return

    setIsGenerating(true)
    
    // Update status to processing
    setUploadedNotes(prev => prev.map(n => 
      n.id === notesId ? { ...n, status: 'processing' } : n
    ))

    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: notes.content,
          examType: 'UPSC',
          subject: 'General Studies',
          count: 15
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const result = await response.json()
      
      const newFlashcards: Flashcard[] = result.flashcards.map((card: any) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        category: card.category || 'General',
        difficulty: card.difficulty || 3,
        createdFrom: 'ai' as const,
        concepts: card.concepts || [],
        memoryTechnique: card.memoryTechnique,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        reviewCount: 0,
        correctCount: 0
      }))

      setFlashcards(prev => [...prev, ...newFlashcards])
      
      // Update notes upload record
      setUploadedNotes(prev => prev.map(n => 
        n.id === notesId ? { 
          ...n, 
          flashcardsGenerated: newFlashcards.length,
          status: 'completed'
        } : n
      ))

      toast({
        title: "Success!",
        description: `Generated ${newFlashcards.length} flashcards from your notes`,
      })

    } catch (error) {
      console.error('Failed to generate flashcards:', error)
      setUploadedNotes(prev => prev.map(n => 
        n.id === notesId ? { ...n, status: 'error' } : n
      ))
      
      toast({
        title: "Generation failed",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Add manual flashcard
  const addManualFlashcard = (newCard: Omit<Flashcard, 'id' | 'nextReview' | 'reviewCount' | 'correctCount'>) => {
    const flashcard: Flashcard = {
      ...newCard,
      id: Date.now().toString() + Math.random(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reviewCount: 0,
      correctCount: 0
    }
    setFlashcards(prev => [...prev, flashcard])
  }

  // Navigation functions
  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const previousCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  // Spaced repetition response
  const handleCardResponse = (isCorrect: boolean) => {
    const card = flashcards[currentCard]
    if (!card) return

    const updatedCard: Flashcard = {
      ...card,
      reviewCount: card.reviewCount + 1,
      correctCount: card.correctCount + (isCorrect ? 1 : 0),
      nextReview: calculateNextReview(card.difficulty, isCorrect, card.reviewCount)
    }

    setFlashcards(prev => prev.map(c => c.id === card.id ? updatedCard : c))
    
    setTimeout(() => {
      nextCard()
    }, 1000)
  }

  const calculateNextReview = (difficulty: number, isCorrect: boolean, reviewCount: number): Date => {
    let daysToAdd: number
    
    if (isCorrect) {
      // Increase interval for correct answers
      daysToAdd = Math.min(30, Math.pow(2, reviewCount) * (difficulty <= 3 ? 1 : 2))
    } else {
      // Reset to short interval for incorrect answers
      daysToAdd = 1
    }
    
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + daysToAdd)
    return nextReview
  }

  const getDueCards = () => {
    const now = new Date()
    return flashcards.filter(card => card.nextReview <= now)
  }

  if (showCreator) {
    return (
      <FlashcardCreator
        onClose={() => setShowCreator(false)}
        onSave={addManualFlashcard}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI-Powered Flashcard System
        </h1>
        <p className="text-gray-600">
          Upload your notes and let AI create flashcards automatically with spaced repetition
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Notes</TabsTrigger>
          <TabsTrigger value="study">Study ({flashcards.length})</TabsTrigger>
          <TabsTrigger value="review">Review ({getDueCards().length})</TabsTrigger>
          <TabsTrigger value="manage">Manage Cards</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Study Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="upload-zone"
                onClick={() => notesInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Upload your study notes
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports TXT and PDF files (minimum 100 characters)
                </p>
              </div>
              <input
                ref={notesInputRef}
                type="file"
                accept=".txt,.pdf"
                multiple
                onChange={handleNotesUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Uploaded Notes */}
          {uploadedNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Notes ({uploadedNotes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedNotes.map(notes => (
                    <div key={notes.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{notes.file.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {(notes.file.size / 1024).toFixed(1)} KB
                          </p>
                          <Badge variant={
                            notes.status === 'completed' ? 'default' :
                            notes.status === 'processing' ? 'secondary' :
                            notes.status === 'error' ? 'destructive' : 'outline'
                          }>
                            {notes.status === 'completed' && `${notes.flashcardsGenerated} cards generated`}
                            {notes.status === 'processing' && 'Processing...'}
                            {notes.status === 'error' && 'Error'}
                            {notes.status === 'pending' && 'Ready to generate'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => generateFlashcardsFromNotes(notes.id)}
                        disabled={isGenerating || notes.status === 'processing' || notes.status === 'completed'}
                        className="flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        {notes.status === 'completed' ? 'Generated' :
                         notes.status === 'processing' ? 'Processing...' : 
                         'Generate Flashcards'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Study Tab */}
        <TabsContent value="study">
          {flashcards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards yet</h3>
                <p className="text-gray-500 mb-4">Upload some notes or create flashcards manually to get started</p>
                <Button onClick={() => setShowCreator(true)}>
                  Create Flashcard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">
                      {currentCard + 1} of {flashcards.length}
                    </span>
                  </div>
                  <Progress value={((currentCard + 1) / flashcards.length) * 100} />
                </CardContent>
              </Card>

              {/* Flashcard */}
              <Card className="mx-auto max-w-2xl">
                <CardContent className="p-8">
                  <div 
                    className="relative h-64 cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}>
                      {/* Front */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 flex items-center justify-center backface-hidden">
                        <div className="text-center">
                          <p className="text-xl mb-4">{flashcards[currentCard]?.front}</p>
                          <div className="flex items-center justify-center gap-2 text-blue-100">
                            <Badge variant="secondary" className="bg-blue-400">
                              {flashcards[currentCard]?.category}
                            </Badge>
                            <span className="text-sm">
                              Difficulty: {flashcards[currentCard]?.difficulty}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 flex items-center justify-center backface-hidden rotate-y-180">
                        <div className="text-center">
                          <p className="text-lg mb-4">{flashcards[currentCard]?.back}</p>
                          {flashcards[currentCard]?.memoryTechnique && (
                            <div className="mt-4 p-3 bg-green-400 bg-opacity-30 rounded-lg">
                              <p className="text-sm">
                                <strong>Memory Tip:</strong> {flashcards[currentCard]?.memoryTechnique}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  {isFlipped && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <Button 
                        variant="destructive"
                        onClick={() => handleCardResponse(false)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Hard
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => handleCardResponse(true)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Easy
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={previousCard} 
                      disabled={flashcards.length <= 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-gray-500">
                      {isFlipped ? 'Rate your recall' : 'Click card to flip'}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={nextCard} 
                      disabled={flashcards.length <= 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Spaced Repetition Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getDueCards().length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-gray-500">No cards are due for review right now.</p>
                </div>
              ) : (
                <div>
                  <p className="mb-4">
                    You have <strong>{getDueCards().length}</strong> cards due for review.
                  </p>
                  <Button onClick={() => setCurrentCard(0)}>
                    Start Review Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Flashcard Collection ({flashcards.length})</span>
                <Button onClick={() => setShowCreator(true)}>
                  Add Card
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flashcards.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No flashcards created yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {flashcards.map((card, index) => (
                    <div key={card.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{card.front}</h4>
                          <p className="text-sm text-gray-600 mb-2">{card.back}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{card.category}</Badge>
                            <Badge variant="secondary">
                              {card.createdFrom === 'ai' ? 'AI Generated' : 
                               card.createdFrom === 'notes' ? 'From Notes' : 'Manual'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Reviewed {card.reviewCount} times
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Next review: {card.nextReview.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            Accuracy: {card.reviewCount > 0 ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
