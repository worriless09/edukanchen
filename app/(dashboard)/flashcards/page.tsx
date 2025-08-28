// app/(dashboard)/flashcards/page.tsx
'use client';

import { useState } from 'react';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import SubjectSelector from '@/components/flashcards/SubjectSelector';
import { Metadata } from 'next';

export default function FlashcardsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const handleSubjectSelect = (subject: string, category: string) => {
    setSelectedSubject(subject);
    setSelectedCategory(category);
  };

  const handleBackToSelector = () => {
    setSelectedSubject(null);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI-Powered Flashcards</h1>
        <p className="text-gray-600 mt-1">
          Master your subjects with spaced repetition algorithm
        </p>
      </div>

      {selectedSubject ? (
        <div>
          <div className="mb-4">
            <button 
              onClick={handleBackToSelector}
              className="text-blue-600 hover:underline"
            >
              ← Back to subjects
            </button>
          </div>
          <FlashcardDeck 
            subject={selectedSubject} 
            category={selectedCategory || undefined} 
          />
        </div>
      ) : (
        <SubjectSelector 
          onSubjectSelect={handleSubjectSelect}
          onCreateNew={() => setShowCreator(true)}
        />
      )}
    </div>
  );
}
