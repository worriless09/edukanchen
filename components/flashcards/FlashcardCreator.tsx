'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, Save } from 'lucide-react'

interface FlashcardData {
  front: string
  back: string
  category: string
  difficulty: number
  createdFrom: 'manual' | 'notes' | 'ai'
  concepts: string[]
  memoryTechnique?: string
}

interface FlashcardCreatorProps {
  onClose: () => void
  onSave: (card: FlashcardData) => void
}

const CATEGORIES = [
  'History',
  'Geography', 
  'Polity',
  'Economics',
  'Science & Technology',
  'Current Affairs',
  'General Studies',
  'Mathematics',
  'Reasoning',
  'English'
]

export function FlashcardCreator({ onClose, onSave }: FlashcardCreatorProps) {
  const [formData, setFormData] = useState<FlashcardData>({
    front: '',
    back: '',
    category: 'General Studies',
    difficulty: 3,
    createdFrom: 'manual',
    concepts: [],
    memoryTechnique: ''
  })
  
  const [newConcept, setNewConcept] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.front.trim() || !formData.back.trim()) {
      return
    }

    onSave(formData)
    onClose()
  }

  const addConcept = () => {
    if (newConcept.trim() && !formData.concepts.includes(newConcept.trim())) {
      setFormData(prev => ({
        ...prev,
        concepts: [...prev.concepts, newConcept.trim()]
      }))
      setNewConcept('')
    }
  }

  const removeConcept = (index: number) => {
    setFormData(prev => ({
      ...prev,
      concepts: prev.concepts.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create New Flashcard</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question (Front) */}
            <div className="space-y-2">
              <Label htmlFor="front">Question / Front Side</Label>
              <Textarea
                id="front"
                placeholder="Enter the question or prompt..."
                value={formData.front}
                onChange={(e) => setFormData(prev => ({ ...prev, front: e.target.value }))}
                rows={3}
                required
              />
            </div>

            {/* Answer (Back) */}
            <div className="space-y-2">
              <Label htmlFor="back">Answer / Back Side</Label>
              <Textarea
                id="back"
                placeholder="Enter the answer or explanation..."
                value={formData.back}
                onChange={(e) => setFormData(prev => ({ ...prev, back: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Category & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty (1-10)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    difficulty: parseInt(e.target.value) || 3 
                  }))}
                />
              </div>
            </div>

            {/* Concepts */}
            <div className="space-y-2">
              <Label>Key Concepts (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a concept..."
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConcept())}
                />
                <Button type="button" onClick={addConcept} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.concepts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.concepts.map((concept, index) => (
                    <div 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {concept}
                      <button
                        type="button"
                        onClick={() => removeConcept(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Memory Technique */}
            <div className="space-y-2">
              <Label htmlFor="memoryTechnique">Memory Technique (Optional)</Label>
              <Textarea
                id="memoryTechnique"
                placeholder="Enter a memory aid, mnemonic, or study tip..."
                value={formData.memoryTechnique}
                onChange={(e) => setFormData(prev => ({ ...prev, memoryTechnique: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Create Flashcard
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
