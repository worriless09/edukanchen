
// components/flashcards/FlashcardDeck.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Flashcard } from '@/types/flashcard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Eye, EyeOff, Plus, BookOpen } from 'lucide-react';
import FlashcardCreator from './FlashcardCreator';
import { Badge } from '@/components/ui/badge';

// Fixed DB row shape that matches the actual Flashcard type
type DbFlashcard = {
  id: string;
  user_id: string;
  subject: string | null;
  category?: string | null;
  question: string | null;
  answer: string | null;
  interval: number | null;
  repetitions: number | null;
  difficulty_level: number | null;
  next_review_date: string | null; // ISO string from Supabase
  review_count: number | null;
  ease_factor: number | null;
  interval_days: number | null;
  created_at: string | null;
  updated_at: string | null;
};

// Fixed mapping function with correct field names
function mapDbToFlashcard(row: DbFlashcard): Flashcard {
  return {
    id: row.id,
    user_id: row.user_id,
    subject: row.subject ?? '',
    category: row.category ?? undefined,
    question: row.question ?? '',
    answer: row.answer ?? '',
    interval: row.interval ?? 0,
    repetitions: row.repetitions ?? 0,
    difficulty_level: row.difficulty_level ?? 2.5,
    next_review_date: row.next_review_date ? new Date(row.next_review_date) : new Date(),
    review_count: row.review_count ?? 0,
    ease_factor: row.ease_factor ?? 2.5,
    interval_days: row.interval_days ?? 0,
    created_at: row.created_at ? new Date(row.created_at) : new Date(),
    updated_at: row.updated_at ? new Date(row.updated_at) : new Date(),
  };
}

interface FlashcardDeckProps {
  subject?: string;
  category?: string;
}

export default function FlashcardDeck({ subject, category }: FlashcardDeckProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [showCreator, setShowCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    } else {
      // Reset local state if user logs out
      setFlashcards([]);
      setSessionCards([]);
      setCurrentCard(null);
      setCurrentIndex(0);
      setShowAnswer(false);
      setSessionStats({ correct: 0, total: 0 });
      setLoading(false);
    }
  }, [user, subject, category]);

  const fetchFlashcards = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let query = supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('next_review_date', { ascending: true });

      if (subject) {
        query = query.eq('subject', subject);
      }
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Map DB rows to app type
      const cards: Flashcard[] = (data ?? []).map((row: DbFlashcard) => mapDbToFlashcard(row));

      setFlashcards(cards);

      // Get cards due for review
      const dueCards = getDueCards(cards);
      setSessionCards(dueCards);

      if (dueCards.length > 0) {
        setCurrentCard(dueCards[0]);
        setCurrentIndex(0);
      } else {
        setCurrentCard(null);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed getDueCards function
  const getDueCards = (cards: Flashcard[]): Flashcard[] => {
    const now = new Date();
    return cards.filter(card => new Date(card.next_review_date) <= now);
  };

  // Fixed getStudyStats function
  const getStudyStats = (cards: Flashcard[]) => {
    const now = new Date();
    const dueCards = cards.filter(card => new Date(card.next_review_date) <= now);
    const newCards = cards.filter(card => card.review_count === 0);
    const learningCards = cards.filter(card => 
      card.review_count > 0 && card.review_count < 3
    );
    const matureCards = cards.filter(card => card.review_count >= 3);
    
    return {
      total: cards.length,
      due: dueCards.length,
      new: newCards.length,
      learning: learningCards.length,
      mature: matureCards.length,
    };
  };

  // Fixed calculateNextReview function
  const calculateNextReview = (card: Flashcard, quality: number): Partial<Flashcard> => {
    let { ease_factor, interval_days, review_count } = card;
    
    // Increment review count
    review_count = (review_count || 0) + 1;
    
    if (quality >= 3) {
      // Correct response
      if (review_count === 1) {
        interval_days = 1;
      } else if (review_count === 2) {
        interval_days = 6;
      } else {
        interval_days = Math.round((interval_days || 1) * (ease_factor || 2.5));
      }
    } else {
      // Incorrect response - restart the learning process
      review_count = 0;
      interval_days = 1;
    }
    
    // Adjust ease factor
    ease_factor = (ease_factor || 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Minimum ease factor of 1.3
    if (ease_factor < 1.3) {
      ease_factor = 1.3;
    }
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval_days);
    
    return {
      ease_factor: Math.round(ease_factor * 100) / 100,
      interval_days,
      review_count,
      next_review_date: nextReviewDate,
      updated_at: new Date(),
    };
  };

  const handleReview = async (quality: number) => {
    if (!currentCard || !user) return;

    try {
      // Calculate next review using spaced repetition algorithm
      const updatedData = calculateNextReview(currentCard, quality);

      // Update in database
      const { error } = await supabase
        .from('flashcards')
        .update(updatedData)
        .eq('id', currentCard.id);

      if (error) throw error;

      // Update session stats
      setSessionStats((prev) => ({
        correct: prev.correct + (quality >= 3 ? 1 : 0),
        total: prev.total + 1,
      }));

      // Move to next card
      const nextIndex = currentIndex + 1;
      if (nextIndex < sessionCards.length) {
        setCurrentCard(sessionCards[nextIndex]);
        setCurrentIndex(nextIndex);
        setShowAnswer(false);
      } else {
        // Session completed
        setCurrentCard(null);
        setShowAnswer(false);
      }
    } catch (err) {
      console.error('Error updating flashcard:', err);
    }
  };

  const resetSession = () => {
    fetchFlashcards();
    setShowAnswer(false);
    setSessionStats({ correct: 0, total: 0 });
  };

  const stats = getStudyStats(flashcards);
  const progress = sessionCards.length > 0 ? (currentIndex / sessionCards.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (showCreator) {
    return (
      <FlashcardCreator
        onClose={() => setShowCreator(false)}
        onCardCreated={() => {
          setShowCreator(false);
          fetchFlashcards();
        }}
        defaultSubject={subject}
        defaultCategory={category}
      />
    );
  }

  if (!currentCard) {
    return (
      <div className="space-y-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.due}</div>
              <div className="text-sm text-gray-600">Due</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.new}</div>
              <div className="text-sm text-gray-600">New</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.learning}</div>
              <div className="text-sm text-gray-600">Learning</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.mature}</div>
              <div className="text-sm text-gray-600">Mature</div>
            </CardContent>
          </Card>
        </div>

        {/* Session Summary */}
        <Card>
          <CardContent className="p-6 text-center">
            {sessionStats.total > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Session Complete! 🎉</h2>
                <div className="text-lg">
                  {`Got ${sessionStats.correct} out of ${sessionStats.total} correct `}
                  ({Math.round((sessionStats.correct / sessionStats.total) * 100)}%)
                </div>
                <Button onClick={resetSession} className="mt-4">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start New Session
                </Button>
              </div>
            ) : stats.due > 0 ? (
              <div className="space-y-4">
                <BookOpen className="h-16 w-16 mx-auto text-blue-500" />
                <h2 className="text-2xl font-bold">Ready to Study!</h2>
                <p className="text-gray-600">There are {stats.due} cards due for review</p>
                <Button onClick={resetSession} size="lg">
                  Start Studying
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400" />
                <h2 className="text-2xl font-bold">All Caught Up!</h2>
                <p className="text-gray-600">No cards due for review. Great job! 🌟</p>
                <Button onClick={() => setShowCreator(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Cards
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Progress: {currentIndex + 1} / {sessionCards.length}
          </span>
          <span>
            Session: {sessionStats.correct}/{sessionStats.total}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Flashcard */}
      <Card className="min-h-96">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {/* Subject Badge */}
            <Badge variant="secondary">{currentCard.subject}</Badge>

            {/* Question */}
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Question:</h2>
              <p className="text-lg leading-relaxed">{currentCard.question}</p>
            </div>

            {/* Answer Section */}
            {showAnswer ? (
              <div className="text-center border-t pt-6 w-full">
                <h3 className="text-lg font-semibold mb-3">Answer:</h3>
                <p className="text-base leading-relaxed text-gray-700">{currentCard.answer}</p>
              </div>
            ) : (
              <Button onClick={() => setShowAnswer(true)} variant="outline" size="lg" className="mt-8">
                <Eye className="h-4 w-4 mr-2" />
                Show Answer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Buttons */}
      {showAnswer && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button onClick={() => handleReview(0)} variant="destructive" className="p-4 h-auto flex-col">
            <span className="font-bold">Again</span>
            <span className="text-xs">Complete blackout</span>
          </Button>

          <Button
            onClick={() => handleReview(2)}
            variant="outline"
            className="p-4 h-auto flex-col border-orange-300 hover:bg-orange-50"
          >
            <span className="font-bold">Hard</span>
            <span className="text-xs">Incorrect but remembered</span>
          </Button>

          <Button
            onClick={() => handleReview(4)}
            variant="outline"
            className="p-4 h-auto flex-col border-green-300 hover:bg-green-50"
          >
            <span className="font-bold">Good</span>
            <span className="text-xs">Correct with effort</span>
          </Button>

          <Button onClick={() => handleReview(5)} className="p-4 h-auto flex-col bg-green-600 hover:bg-green-700">
            <span className="font-bold">Easy</span>
            <span className="text-xs">Perfect recall</span>
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setShowCreator(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>

        {showAnswer && (
          <Button variant="ghost" onClick={() => setShowAnswer(false)}>
            <EyeOff className="h-4 w-4 mr-2" />
            Hide Answer
          </Button>
        )}
      </div>
    </div>
  );
}


