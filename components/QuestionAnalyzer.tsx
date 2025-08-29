// 7. React Component Example (components/QuestionAnalyzer.tsx)
'use client';

import { useState } from 'react';
import { useQuestionAnalysis } from '@/hooks/useQuestionAnalysis';

interface QuestionAnalyzerProps {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  subject: string;
}

export const QuestionAnalyzer = ({ 
  question, 
  userAnswer, 
  correctAnswer, 
  subject 
}: QuestionAnalyzerProps) => {
  const { analyzeQuestion, loading, error } = useQuestionAnalysis();
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    const result = await analyzeQuestion(
      question,
      userAnswer,
      correctAnswer,
      'medium',
      subject
    );
    setAnalysis(result);
  };

  return (
    <div className="p-4 border rounded-lg">
      <button 
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze with AI'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {analysis && (
        <div className="mt-4 space-y-3">
          <div className={`p-3 rounded ${analysis.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className="font-semibold">
              {analysis.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p>Confidence: {(analysis.confidence * 100).toFixed(0)}%</p>
            <p>Next review in: {analysis.nextReviewInterval} hours</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded">
            <h4 className="font-semibold">Explanation:</h4>
            <p>{analysis.explanation}</p>
          </div>

          {analysis.mnemonics && (
            <div className="p-3 bg-yellow-50 rounded">
              <h4 className="font-semibold">Memory Technique:</h4>
              <p>{analysis.mnemonics}</p>
            </div>
          )}

          {analysis.keyPoints.length > 0 && (
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold">Key Points:</h4>
              <ul className="list-disc pl-5">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
