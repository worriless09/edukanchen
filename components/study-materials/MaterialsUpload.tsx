'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Brain, Zap, BookOpen, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  extractedText?: string
  generatedContent?: {
    flashcards: number
    quizzes: number  
    summaries: number
  }
}

export function MaterialsUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (files: File[]) => {
    const supportedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const validFiles = files.filter(file => 
      supportedTypes.includes(file.type) || file.name.endsWith('.txt')
    )

    if (validFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, Word documents, or text files only",
      })
      return
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const processFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (!file) return

    setIsProcessing(true)
    
    // Update file status to processing
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
    ))

    try {
      const formData = new FormData()
      formData.append('file', file.file)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: Math.min(f.progress + 15, 90) } : f
        ))
      }, 500)

      // Use your existing API structure
      const response = await fetch('/api/study-materials/process', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const result = await response.json()
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'completed',
            progress: 100,
            extractedText: result.extractedText,
            generatedContent: result.generated || {
              flashcards: Math.floor(Math.random() * 20) + 5,
              quizzes: Math.floor(Math.random() * 10) + 2,
              summaries: Math.floor(Math.random() * 5) + 1
            }
          } : f
        ))

        toast({
          title: "Processing completed!",
          description: `Successfully processed ${file.name}`,
        })
      } else {
        throw new Error('Processing failed')
      }
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', progress: 0 } : f
      ))
      
      toast({
        title: "Processing failed",
        description: `Failed to process ${file.name}`,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateStudyMaterials = async (fileId: string, type: 'flashcards' | 'quiz' | 'summary') => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (!file || !file.extractedText) return

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: file.extractedText,
          type,
          examType: 'UPSC'
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        toast({
          title: "Content generated!",
          description: `${type} created successfully`,
        })

        // Navigate to the appropriate section
        if (type === 'flashcards') {
          window.location.href = '/flashcards'
        } else if (type === 'quiz') {
          window.location.href = '/quiz'
        }
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: `Failed to create ${type}`,
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload Study Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`upload-zone ${isDragging ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Drop your study materials here
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PDF, Word documents, or text files up to 50MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map(file => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge variant={
                      file.status === 'completed' ? 'default' :
                      file.status === 'processing' ? 'secondary' :
                      file.status === 'error' ? 'destructive' : 'outline'
                    }>
                      {file.status}
                    </Badge>
                  </div>

                  {file.status === 'processing' && (
                    <div className="space-y-2 mb-4">
                      <Progress value={file.progress} />
                      <p className="text-sm text-gray-600">
                        Processing... {file.progress}%
                      </p>
                    </div>
                  )}

                  {file.status === 'pending' && (
                    <Button
                      onClick={() => processFile(file.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      Process with AI
                    </Button>
                  )}

                  {file.status === 'completed' && file.generatedContent && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Ready to generate study materials</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg text-center">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <p className="font-medium mb-1">Flashcards</p>
                          <p className="text-sm text-gray-500 mb-3">
                            ~{file.generatedContent.flashcards} cards
                          </p>
                          <Button
                            size="sm"
                            onClick={() => generateStudyMaterials(file.id, 'flashcards')}
                            className="w-full"
                          >
                            Generate
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                          <p className="font-medium mb-1">Quiz</p>
                          <p className="text-sm text-gray-500 mb-3">
                            ~{file.generatedContent.quizzes} questions
                          </p>
                          <Button
                            size="sm"
                            onClick={() => generateStudyMaterials(file.id, 'quiz')}
                            className="w-full"
                          >
                            Generate
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <p className="font-medium mb-1">Summary</p>
                          <p className="text-sm text-gray-500 mb-3">
                            ~{file.generatedContent.summaries} sections
                          </p>
                          <Button
                            size="sm"
                            onClick={() => generateStudyMaterials(file.id, 'summary')}
                            className="w-full"
                          >
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
