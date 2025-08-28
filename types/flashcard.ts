// types/flashcard.ts
export interface Flashcard {
  id: string;
  user_id: string;
  subject: string;
  category?: string;
  question: string;
  answer: string;
  interval: number;
  repetitions: number;
  difficulty_level: number;
  next_review_date: Date;
  review_count: number;
  ease_factor: number;
  interval_days: number;
  created_at: Date;
  updated_at: Date;
}