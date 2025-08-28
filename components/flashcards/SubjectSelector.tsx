// components/flashcards/SubjectSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus } from 'lucide-react';
import { getStudyStats } from '@/lib/algorithms/spacedRepetition';

interface SubjectStats {
  subject: string;
  category: string;
  total: number;
  due: number;
}

interface SubjectSelectorProps {
  onSubjectSelect: (subject: string, category: string) => void;
  onCreateNew: () => void;
}

export default function SubjectSelector({ onSubjectSelect, onCreateNew }: SubjectSelectorProps) {
  const [subjects, setSubjects] = useState<SubjectStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('subject, category, next_review_date')
        .eq('user_id', user.id);

      if (error) throw error;

      // Group by subject and category
      const grouped = data.reduce((acc, card) => {
        const key = `${card.subject}-${card.category || 'general'}`;
        if (!acc[key]) {
          acc[key] = {
            subject: card.subject,
            category: card.category || 'general',
            cards: [],
          };
        }
        acc[key].cards.push(card);
        return acc;
      }, {} as Record<string, any>);

      // Calculate stats for each subject
      const subjectStats: SubjectStats[] = Object.values(grouped).map((group: any) => {
        const stats = getStudyStats(group.cards);
        return {
          subject: group.subject,
          category: group.category,
          total: stats.total,
          due: stats.due,
        };
      });

      setSubjects(subjectStats.sort((a, b) => b.due - a.due));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Flashcards</h2>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Card
        </Button>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card 
              key={`${subject.subject}-${subject.category}`}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSubjectSelect(subject.subject, subject.category)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                    <Badge variant="outline">{subject.category}</Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{subject.subject}</h3>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{subject.total} total cards</span>
                    {subject.due > 0 && (
                      <Badge variant="destructive">{subject.due} due</Badge>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={subject.due > 0 ? "default" : "outline"}
                  >
                    {subject.due > 0 ? `Study ${subject.due} cards` : 'Review'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No flashcards yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first flashcard to start studying with spaced repetition
            </p>
            <Button onClick={onCreateNew} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}