// app/labs/page.tsx
'use client';
import Link from 'next/link';

export default function LabsPage() {
  const labs = [
    {
      id: 'flashcard-generator',
      name: 'AI Flashcard Generator',
      description: 'Generate intelligent flashcards from any topic',
      difficulty: 'Easy',
      estimatedTime: '15 min',
      isAvailable: true
    },
    {
      id: 'current-affairs',
      name: 'Current Affairs Analyzer',
      description: 'Analyze news for UPSC relevance',
      difficulty: 'Medium', 
      estimatedTime: '20 min',
      isAvailable: false // Coming soon
    },
    {
      id: 'mock-interview',
      name: 'Mock Interview',
      description: 'Practice UPSC interviews with AI',
      difficulty: 'Hard',
      estimatedTime: '60 min',
      isAvailable: false // Coming soon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Labs
          </h1>
          <p className="text-xl text-gray-600">
            Interactive AI-powered tools to supercharge your exam preparation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-2">{lab.name}</h3>
              <p className="text-gray-600 mb-4">{lab.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  ⏱ {lab.estimatedTime}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  lab.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  lab.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {lab.difficulty}
                </span>
              </div>
              
              {lab.isAvailable ? (
                <Link href={`/labs/${lab.id}`}>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Open Lab
                  </button>
                </Link>
              ) : (
                <button 
                  disabled 
                  className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to revolutionize your study method?
          </h2>
          <p className="text-gray-600 mb-6">
            Start with our AI Flashcard Generator - completely free, no signup required
          </p>
          <Link href="/labs/flashcard-generator">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Try Flashcard Generator
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}