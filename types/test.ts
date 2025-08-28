// types/test.ts
export interface MockTest {
  id: string;
  title: string;
  description?: string;
  category?: string;
  total_questions: number;
  time_limit: number;
  total_marks: number;
  tier: 'free' | 'premium';
  questions?: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  mock_test_id?: string;
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation?: string;
  marks: number;
  difficulty_level: string;
  subject?: string;
  order_index: number;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  mock_test_id: string;
  answers: Record<string, string>;
  score: number;
  total_marks: number;
  time_taken: number;
  percentage: number;
  rank?: number;
  completed_at: string;
}
