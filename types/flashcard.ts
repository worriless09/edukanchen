// types/flashcard.ts
export interface Flashcard {
  id: string;
  user_id: string;
  subject: string;
  category?: string;
  question: string;
  answer: string;
  difficulty_level: number;
  next_review_date: string;
  review_count: number;
  ease_factor: number;
  interval_days: number;
}