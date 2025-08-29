import { useState, useCallback } from 'react';
import { aiService } from '@/lib/api/aiService';
import { ReasoningRequest, ReasoningResponse, SpacedRepetitionData } from '@/types/ai';

interface UseAIState {
  isLoading: boolean;
  error: string | null;
  data: ReasoningResponse | null;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const analyzeQuestion = useCallback(async (request: ReasoningRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await aiService.getReasoningAnalysis(request);
      
      if (response.success && response.data) {
        setState({
          isLoading: false,
          error: null,
          data: response.data,
        });
        return response.data;
      } else {
        const errorMessage = response.error || 'Unknown error occurred';
        setState({
          isLoading: false,
          error: errorMessage,
          data: null,
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze question';
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    ...state,
    analyzeQuestion,
    clearError,
    reset,
  };
}

export function useSpacedRepetition() {
  const [repetitionData, setRepetitionData] = useState<SpacedRepetitionData>({
    nextReview: null,
    difficulty: 1,
    repetitionCount: 0,
  });

  const calculateNextReview = useCallback((difficulty: number, isCorrect: boolean) => {
    const intervals = [1, 3, 7, 14, 30, 90]; // days
    let nextInterval = intervals[0];

    if (isCorrect) {
      const currentCount = repetitionData.repetitionCount;
      nextInterval = intervals[Math.min(currentCount, intervals.length - 1)];
      
      if (difficulty >= 8) {
        nextInterval *= 0.7;
      } else if (difficulty <= 3) {
        nextInterval *= 1.3;
      }
    } else {
      nextInterval = 1;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + Math.ceil(nextInterval));

    setRepetitionData({
      nextReview,
      difficulty,
      repetitionCount: repetitionData.repetitionCount + 1,
    });

    return nextReview;
  }, [repetitionData.repetitionCount]);

  return {
    ...repetitionData,
    calculateNextReview,
  };
}