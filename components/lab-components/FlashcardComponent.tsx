// 13. Lab Components Library
// components/lab-components/FlashcardComponent.tsx

'use client';
import { useState } from 'react';

interface FlashcardProps {
  card: {
    id: string;
    question: string;
    answer: string;
    difficulty: string;
    topic: string;
  };
  onRate?: (rating: 'easy' | 'medium' | 'hard') => void;
  showRating?: boolean;
}

export const FlashcardComponent: React.FC<FlashcardProps> = ({ 
  card, 
  onRate,
  showRating = true 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = (rating: 'easy' | 'medium' | 'hard') => {
    if (onRate) {
      onRate(rating);
      setHasRated(true);
    }
  };

  return (
    <div className="relative w-full h-80 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-blue-200 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg">
          <div className="text-sm text-blue-600 font-medium mb-4">QUESTION</div>
          <div className="text-lg text-center text-gray-800 leading-relaxed">
            {card.question}
          </div>
          <div className="mt-6 text-sm text-gray-500">
            Click to reveal answer
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-green-50 border-2 border-green-200 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg">
          <div className="text-sm text-green-600 font-medium mb-4">ANSWER</div>
          <div className="text-lg text-center text-gray-800 leading-relaxed mb-6">
            {card.answer}
          </div>
          
          {showRating && !hasRated && (
            <div className="mt-auto">
              <p className="text-sm text-gray-600 mb-3 text-center">How easy was this?</p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate('hard');
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  😰 Hard
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate('medium');
                  }}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  🤔 Medium
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate('easy');
                  }}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  😊 Easy
                </button>
              </div>
            </div>
          )}
          
          {hasRated && (
            <div className="mt-auto text-center">
              <div className="text-green-600 text-sm">✅ Rated</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};