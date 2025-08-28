// components/flashcards/FlashcardCreator.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FlashcardCreatorProps {
  onClose: () => void;
  onCardCreated: () => void;
  defaultSubject?: string;
  defaultCategory?: string;
}

export default function FlashcardCreator({ 
  onClose, 
  onCardCreated, 
  defaultSubject,
  defaultCategory 
}: FlashcardCreatorProps) {
  const [formData, setFormData] = useState({
    subject: defaultSubject || '',
    category: defaultCategory || '',
    question: '',
    answer: '',
    difficulty_level: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          ...formData,
          next_review_date: new Date().toISOString(),
          review_count: 0,
          ease_factor: 2.5,
          interval_days: 1,
        });

      if (error) throw error;

      onCardCreated();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Create New Flashcard</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="e.g., History, Geography, Polity"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upsc">UPSC</SelectItem>
                  <SelectItem value="ssc">SSC</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                  <SelectItem value="railway">Railway</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="state-pcs">State PCS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="Enter your question here..."
              className="min-h-24"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              placeholder="Enter the answer here..."
              className="min-h-32"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={formData.difficulty_level.toString()} 
              onValueChange={(value) => handleInputChange('difficulty_level', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Very Easy</SelectItem>
                <SelectItem value="2">2 - Easy</SelectItem>
                <SelectItem value="3">3 - Medium</SelectItem>
                <SelectItem value="4">4 - Hard</SelectItem>
                <SelectItem value="5">5 - Very Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Flashcard'}
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
