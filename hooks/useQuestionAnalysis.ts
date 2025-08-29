// 6. React Hook for Question Analysis (hooks/useQuestionAnalysis.ts)
import { useState } from 'react';

interface AnalysisResult {
  isCorrect: boolean;
  confidence: number;
  nextReviewInterval: number;
  explanation: string;
  keyPoints: string[];
  mnemonics: string;
  difficultyAssessment: string;
  recommendations: string[];
}

export const useQuestionAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeQuestion = async (
    question: string,
    userAnswer: string,
    correctAnswer: string,
    difficulty: string,
    subject: string
  ): Promise<AnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          userAnswer,
          correctAnswer,
          difficulty,
          subject,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeQuestion, loading, error };
};