// types/database.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          subscription_tier: 'free' | 'premium';
          subscription_expires_at: string | null;
          razorpay_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          subscription_tier?: 'free' | 'premium';
          subscription_expires_at?: string | null;
          razorpay_customer_id?: string | null;
        };
        Update: {
          full_name?: string | null;
          subscription_tier?: 'free' | 'premium';
          subscription_expires_at?: string | null;
          razorpay_customer_id?: string | null;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string | null;
          tier: 'free' | 'premium';
          price: number;
          thumbnail_url: string | null;
          instructor_name: string | null;
          duration_hours: number;
          total_videos: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      videos: {
        Row: {
          id: string;
          course_id: string | null;
          title: string;
          description: string | null;
          video_url: string;
          thumbnail_url: string | null;
          duration: number;
          order_index: number;
          tier: 'free' | 'premium';
          is_published: boolean;
          created_at: string;
        };
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          category: string | null;
          question: string;
          answer: string;
          difficulty_level: number;
          next_review_date: string;
          review_count: number;
          ease_factor: number;
          interval_days: number;
          created_at: string;
        };
      };
      mock_tests: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string | null;
          total_questions: number;
          time_limit: number;
          total_marks: number;
          tier: 'free' | 'premium';
          is_published: boolean;
          created_at: string;
        };
      };
      test_questions: {
        Row: {
          id: string;
          mock_test_id: string | null;
          question: string;
          options: Record<string, string>;
          correct_answer: string;
          explanation: string | null;
          marks: number;
          difficulty_level: string;
          subject: string | null;
          order_index: number;
        };
      };
    };
  };
}