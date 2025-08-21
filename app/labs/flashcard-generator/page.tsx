// app/labs/flashcard-generator/page.tsx
'use client';
import { useState } from 'react';

export default function FlashcardGeneratorLab() {
  const [topic, setTopic] = useState('');
  const [examType, setExamType] = useState('UPSC');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState([]);

  const generateFlashcards = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    
    try {
      // For now, create mock flashcards to test the UI
      // Replace this with actual API call once HRM service is updated
      const mockFlashcards = [
        {
          id: '1',
          question: `What are the key features of ${topic}?`,
          answer: `${topic} has several important characteristics that are crucial for ${examType} preparation...`,
          difficulty: 'medium',
          topic: topic
        },
        {
          id: '2', 
          question: `Explain the significance of ${topic} in Indian context`,
          answer: `In the Indian context, ${topic} plays a vital role because...`,
          difficulty: 'medium',
          topic: topic
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFlashcards(mockFlashcards);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Perplexity-style header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="text-sm hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center gap-2 font-mono text-gray-700">
                <span>🎓</span>
                <span>Made with Kanchen Academy</span>
              </div>
            </button>
          </div>
          <div className="text-sm text-gray-600">
            AI Flashcard Generator
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            AI Flashcard Generator
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Indian Constitution Fundamental Rights"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="UPSC">UPSC Civil Services</option>
                <option value="SSC">SSC</option>
                <option value="Banking">Banking</option>
                <option value="Railway">Railway</option>
              </select>
            </div>
            
            <button
              onClick={generateFlashcards}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Flashcards'}
            </button>
          </div>

          {/* Display generated flashcards */}
          {flashcards.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Generated Flashcards</h2>
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <FlashcardDisplay key={card.id} card={card} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FlashcardDisplay = ({ card, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <span className="text-sm font-medium text-gray-600">
          Card {index + 1}: {card.topic}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-blue-600 font-medium mb-2">QUESTION</div>
          <div className="text-gray-800">{card.question}</div>
        </div>
        
        {showAnswer ? (
          <div>
            <div className="text-sm text-green-600 font-medium mb-2">ANSWER</div>
            <div className="text-gray-800 bg-green-50 p-3 rounded">
              {card.answer}
            </div>
            <button
              onClick={() => setShowAnswer(false)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Hide Answer
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Show Answer
          </button>
        )}
      </div>
    </div>
  );
};