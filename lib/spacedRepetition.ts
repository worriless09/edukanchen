// 8. Spaced Repetition Algorithm (lib/spacedRepetition.ts)
export interface ReviewData {
  questionId: string;
  userId: string;
  lastReviewed: Date;
  nextReview: Date;
  interval: number; // in hours
  easeFactor: number;
  reviewCount: number;
  consecutiveCorrect: number;
}

export class SpacedRepetitionManager {
  static calculateNextReview(
    isCorrect: boolean,
    confidence: number,
    currentInterval: number = 1,
    easeFactor: number = 2.5
  ): { nextInterval: number; newEaseFactor: number } {
    if (!isCorrect) {
      return { nextInterval: 1, newEaseFactor: Math.max(1.3, easeFactor - 0.2) };
    }

    // Ebbinghaus-based calculation with confidence factor
    const confidenceMultiplier = 0.5 + (confidence * 0.5); // 0.5 to 1.0
    const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (1 - confidence) * 0.08));
    const nextInterval = Math.round(currentInterval * easeFactor * confidenceMultiplier);

    return { nextInterval, newEaseFactor };
  }

  static async updateReviewSchedule(
    questionId: string,
    userId: string,
    isCorrect: boolean,
    confidence: number
  ) {
    // This would integrate with your Supabase database
    // to update review schedules based on performance
  }
}