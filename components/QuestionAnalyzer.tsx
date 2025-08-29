'use client';

import React, { useState } from 'react';
import { useAI, useSpacedRepetition } from '@/hooks/useAI';

const QuestionAnalyzer = () => {
  const [question, setQuestion] = useState('');
  const [examType, setExamType] = useState<'UPSC' | 'SSC' | 'Banking' | 'Railway' | 'Defense' | 'General'>('UPSC');
  const [context, setContext] = useState('');
  
  const { isLoading, error, data, analyzeQuestion, clearError } = useAI();
  const { nextReview, calculateNextReview } = useSpacedRepetition();

  const handleAnalyze = async () => {
    if (!question.trim()) return;
    
    try {
      clearError();
      const result = await analyzeQuestion({
        question,
        context,
        examType,
      });
      
      if (result.difficulty) {
        calculateNextReview(result.difficulty, true);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleAnswerFeedback = (isCorrect: boolean) => {
    if (data?.difficulty) {
      calculateNextReview(data.difficulty, isCorrect);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Question Analyzer</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value as typeof examType)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UPSC">UPSC</option>
            <option value="SSC">SSC</option>
            <option value="Banking">Banking</option>
            <option value="Railway">Railway</option>
            <option value="Defense">Defense</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Any additional context or specific area to focus on..."
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !question.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Question'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Analysis Results</h3>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-600">Difficulty Level: </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                data.difficulty >= 8 ? 'bg-red-100 text-red-800' :
                data.difficulty >= 5 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {data.difficulty}/10
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Detailed Reasoning:</h4>
              <div className="bg-white p-4 rounded border text-gray-800 whitespace-pre-wrap">
                {data.reasoning}
              </div>
            </div>

            {data.concepts && data.concepts.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Key Concepts for Review:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.concepts.map((concept, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.relatedTopics && data.relatedTopics.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Related Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.relatedTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.memoryTechniques && data.memoryTechniques.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Memory Techniques:</h4>
                <ul className="bg-white p-4 rounded border">
                  {data.memoryTechniques.map((technique, index) => (
                    <li key={index} className="text-gray-800 mb-1">
                      • {technique}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-3">Spaced Repetition Schedule</h4>
            {nextReview && (
              <p className="text-blue-700 mb-3">
                Next Review: {nextReview.toLocaleDateString('en-IN')}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswerFeedback(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Got it Right ✓
              </button>
              <button
                onClick={() => handleAnswerFeedback(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Need Review ✗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionAnalyzer;