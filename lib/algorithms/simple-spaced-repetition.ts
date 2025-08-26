// lib/algorithms/simple-spaced-repetition.ts

export interface SpacedRepetitionResult {
  nextReviewDate: Date;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface ReviewData {
  quality: number; // 0-5 (0 = complete blackout, 5 = perfect response)
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
}

/**
 * Simple SM-2 (SuperMemo 2) spaced repetition algorithm
 * Based on the original algorithm by Piotr Wozniak
 */
export function calculateNextReview(reviewData: ReviewData): SpacedRepetitionResult {
  const { quality } = reviewData;
  let easeFactor = reviewData.easeFactor || 2.5;
  let interval = reviewData.interval || 1;
  let repetitions = reviewData.repetitions || 0;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor based on quality
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    nextReviewDate,
    easeFactor,
    interval,
    repetitions
  };
}

/**
 * Get initial review data for a new flashcard
 */
export function getInitialReviewData(): Omit<SpacedRepetitionResult, 'nextReviewDate'> {
  return {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0
  };
}

/**
 * Calculate optimal study session size based on available cards
 */
export function calculateOptimalSessionSize(
  totalDueCards: number,
  userPreference: number = 20,
  maxRecommended: number = 50
): number {
  return Math.min(
    Math.max(userPreference, Math.ceil(totalDueCards * 0.3)),
    maxRecommended
  );
}

/**
 * Quality score descriptions for user interface
 */
export const QUALITY_DESCRIPTIONS = {
  5: "Perfect - Answered with complete confidence",
  4: "Good - Correct answer with minor hesitation",
  3: "Fair - Correct answer with effort or after thinking",
  2: "Hard - Incorrect but recognized the correct answer",
  1: "Very Hard - Incorrect answer, but familiar with the topic",
  0: "Blackout - Complete inability to remember"
} as const;