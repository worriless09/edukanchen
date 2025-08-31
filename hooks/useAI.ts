// hooks/useAI.ts - COMPLETE IMPLEMENTATION
'use client';

import { useState, useCallback } from 'react';

interface AnalyzeQuestionRequest {
  question: string;
  context?: string;
  examType: string;
}

interface AnalysisResult {
  difficulty: number;
  reasoning: string;
  concepts?: string[];
  relatedTopics?: string[];
  memoryTechniques?: string[];
  nextReview?: Date;
}

interface SpacedRepetitionData {
  nextReview: Date | null;
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);

  const analyzeQuestion = useCallback(async (request: AnalyzeQuestionRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze question');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    analyzeQuestion,
    clearError,
  };
};

export const useSpacedRepetition = () => {
  const [nextReview, setNextReview] = useState<Date | null>(null);

  const calculateNextReview = useCallback((difficulty: number, isCorrect: boolean) => {
    let daysToAdd: number;
    
    if (isCorrect) {
      // Increase interval for correct answers
      daysToAdd = Math.min(30, Math.pow(2, difficulty) * (difficulty <= 3 ? 1 : 2));
    } else {
      // Reset to short interval for incorrect answers  
      daysToAdd = 1;
    }
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
    setNextReview(nextReviewDate);
    
    return nextReviewDate;
  }, []);

  return {
    nextReview,
    calculateNextReview,
  };
};
