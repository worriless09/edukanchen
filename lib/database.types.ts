export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      course_analytics: {
        Row: {
          average_progress_percentage: number | null
          average_session_duration: number | null
          average_student_rating: number | null
          completion_count: number | null
          course_id: string | null
          created_at: string | null
          date: string
          dropout_count: number | null
          id: string
          lessons_completed: number | null
          new_enrollments: number | null
          revenue_generated: number | null
          total_active_students: number | null
          total_watch_time: number | null
        }
        Insert: {
          average_progress_percentage?: number | null
          average_session_duration?: number | null
          average_student_rating?: number | null
          completion_count?: number | null
          course_id?: string | null
          created_at?: string | null
          date: string
          dropout_count?: number | null
          id?: string
          lessons_completed?: number | null
          new_enrollments?: number | null
          revenue_generated?: number | null
          total_active_students?: number | null
          total_watch_time?: number | null
        }
        Update: {
          average_progress_percentage?: number | null
          average_session_duration?: number | null
          average_student_rating?: number | null
          completion_count?: number | null
          course_id?: string | null
          created_at?: string | null
          date?: string
          dropout_count?: number | null
          id?: string
          lessons_completed?: number | null
          new_enrollments?: number | null
          revenue_generated?: number | null
          total_active_students?: number | null
          total_watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_analytics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          attachments: Json | null
          content_text: string | null
          content_url: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_free_preview: boolean | null
          is_published: boolean | null
          lesson_type: string | null
          module_id: string | null
          notes: string | null
          requires_completion_of: string[] | null
          sort_order: number
          title: string
          transcript: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          content_text?: string | null
          content_url?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          notes?: string | null
          requires_completion_of?: string[] | null
          sort_order: number
          title: string
          transcript?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          content_text?: string | null
          content_url?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          notes?: string | null
          requires_completion_of?: string[] | null
          sort_order?: number
          title?: string
          transcript?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          estimated_duration: number | null
          id: string
          is_free_preview: boolean | null
          is_published: boolean | null
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          sort_order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          average_rating: number | null
          co_instructors: string[] | null
          course_type: string | null
          created_at: string | null
          currency: string | null
          current_enrollment: number | null
          description: string | null
          difficulty_level: number | null
          discounted_fee: number | null
          end_date: string | null
          enrollment_end_date: string | null
          enrollment_start_date: string | null
          estimated_hours: number | null
          exam_type: string
          fee: number | null
          id: string
          is_featured: boolean | null
          is_free: boolean | null
          learning_outcomes: string[] | null
          max_students: number | null
          meta_description: string | null
          meta_title: string | null
          prerequisites: string[] | null
          primary_instructor_id: string | null
          short_description: string | null
          slug: string
          start_date: string | null
          status: string | null
          subject_id: string | null
          syllabus_pdf_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          total_lessons: number | null
          total_ratings: number | null
          total_views: number | null
          trailer_video_url: string | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          co_instructors?: string[] | null
          course_type?: string | null
          created_at?: string | null
          currency?: string | null
          current_enrollment?: number | null
          description?: string | null
          difficulty_level?: number | null
          discounted_fee?: number | null
          end_date?: string | null
          enrollment_end_date?: string | null
          enrollment_start_date?: string | null
          estimated_hours?: number | null
          exam_type: string
          fee?: number | null
          id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          learning_outcomes?: string[] | null
          max_students?: number | null
          meta_description?: string | null
          meta_title?: string | null
          prerequisites?: string[] | null
          primary_instructor_id?: string | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          status?: string | null
          subject_id?: string | null
          syllabus_pdf_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_lessons?: number | null
          total_ratings?: number | null
          total_views?: number | null
          trailer_video_url?: string | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          co_instructors?: string[] | null
          course_type?: string | null
          created_at?: string | null
          currency?: string | null
          current_enrollment?: number | null
          description?: string | null
          difficulty_level?: number | null
          discounted_fee?: number | null
          end_date?: string | null
          enrollment_end_date?: string | null
          enrollment_start_date?: string | null
          estimated_hours?: number | null
          exam_type?: string
          fee?: number | null
          id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          learning_outcomes?: string[] | null
          max_students?: number | null
          meta_description?: string | null
          meta_title?: string | null
          prerequisites?: string[] | null
          primary_instructor_id?: string | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          status?: string | null
          subject_id?: string | null
          syllabus_pdf_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_lessons?: number | null
          total_ratings?: number | null
          total_views?: number | null
          trailer_video_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_primary_instructor_id_fkey"
            columns: ["primary_instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string | null
          amount_paid: number | null
          certificate_issued: boolean | null
          completion_date: string | null
          course_id: string | null
          enrolled_at: string | null
          enrollment_type: string | null
          id: string
          last_accessed_at: string | null
          lessons_completed: number | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          progress_percentage: number | null
          status: string | null
          total_study_time: number | null
          user_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          amount_paid?: number | null
          certificate_issued?: boolean | null
          completion_date?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          enrollment_type?: string | null
          id?: string
          last_accessed_at?: string | null
          lessons_completed?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          progress_percentage?: number | null
          status?: string | null
          total_study_time?: number | null
          user_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          amount_paid?: number | null
          certificate_issued?: boolean | null
          completion_date?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          enrollment_type?: string | null
          id?: string
          last_accessed_at?: string | null
          lessons_completed?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          progress_percentage?: number | null
          status?: string | null
          total_study_time?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_decks: {
        Row: {
          allow_collaboration: boolean | null
          average_retention_rate: number | null
          category: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          exam_type: string | null
          id: string
          is_public: boolean | null
          original_deck_id: string | null
          shared_with: string[] | null
          subject_id: string | null
          tags: string[] | null
          title: string
          total_cards: number | null
          total_studies: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allow_collaboration?: boolean | null
          average_retention_rate?: number | null
          category?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          exam_type?: string | null
          id?: string
          is_public?: boolean | null
          original_deck_id?: string | null
          shared_with?: string[] | null
          subject_id?: string | null
          tags?: string[] | null
          title: string
          total_cards?: number | null
          total_studies?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allow_collaboration?: boolean | null
          average_retention_rate?: number | null
          category?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          exam_type?: string | null
          id?: string
          is_public?: boolean | null
          original_deck_id?: string | null
          shared_with?: string[] | null
          subject_id?: string | null
          tags?: string[] | null
          title?: string
          total_cards?: number | null
          total_studies?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_decks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_decks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          audio_url: string | null
          average_quality: number | null
          back_image_url: string | null
          back_text: string
          card_type: string | null
          created_at: string | null
          deck_id: string | null
          difficulty: number | null
          explanation: string | null
          front_image_url: string | null
          front_text: string
          hints: string[] | null
          id: string
          is_active: boolean | null
          mnemonics: string | null
          related_concepts: string[] | null
          sort_order: number | null
          success_rate: number | null
          tags: string[] | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          average_quality?: number | null
          back_image_url?: string | null
          back_text: string
          card_type?: string | null
          created_at?: string | null
          deck_id?: string | null
          difficulty?: number | null
          explanation?: string | null
          front_image_url?: string | null
          front_text: string
          hints?: string[] | null
          id?: string
          is_active?: boolean | null
          mnemonics?: string | null
          related_concepts?: string[] | null
          sort_order?: number | null
          success_rate?: number | null
          tags?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          average_quality?: number | null
          back_image_url?: string | null
          back_text?: string
          card_type?: string | null
          created_at?: string | null
          deck_id?: string | null
          difficulty?: number | null
          explanation?: string | null
          front_image_url?: string | null
          front_text?: string
          hints?: string[] | null
          id?: string
          is_active?: boolean | null
          mnemonics?: string | null
          related_concepts?: string[] | null
          sort_order?: number | null
          success_rate?: number | null
          tags?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "flashcard_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          bookmarked: boolean | null
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          difficulty_rating: number | null
          id: string
          lesson_id: string | null
          notes_taken: string | null
          progress_percentage: number | null
          started_at: string | null
          status: string | null
          time_spent: number | null
          updated_at: string | null
          user_id: string | null
          video_watch_time: number | null
        }
        Insert: {
          bookmarked?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          difficulty_rating?: number | null
          id?: string
          lesson_id?: string | null
          notes_taken?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_watch_time?: number | null
        }
        Update: {
          bookmarked?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          difficulty_rating?: number | null
          id?: string
          lesson_id?: string | null
          notes_taken?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          content: string
          created_at: string | null
          delivery_methods: string[] | null
          id: string
          is_active: boolean | null
          name: string
          notification_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          delivery_methods?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          notification_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          delivery_methods?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          notification_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          failed_at: string | null
          failure_reason: string | null
          gateway_order_id: string | null
          gateway_payment_id: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          initiated_at: string | null
          payment_gateway: string | null
          payment_method: string | null
          reference_id: string | null
          retry_count: number | null
          status: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gateway_order_id?: string | null
          gateway_payment_id?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          initiated_at?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          reference_id?: string | null
          retry_count?: number | null
          status?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gateway_order_id?: string | null
          gateway_payment_id?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          initiated_at?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          reference_id?: string | null
          retry_count?: number | null
          status?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number | null
          correct_answers: number | null
          created_at: string | null
          id: string
          incorrect_answers: number | null
          marks_obtained: number | null
          percentage: number | null
          percentile: number | null
          questions_attempted: number | null
          quiz_id: string | null
          rank_category: number | null
          rank_overall: number | null
          started_at: string | null
          status: string | null
          submitted_at: string | null
          time_taken: number | null
          total_marks: number | null
          total_questions: number | null
          unanswered: number | null
          user_id: string | null
        }
        Insert: {
          attempt_number?: number | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          incorrect_answers?: number | null
          marks_obtained?: number | null
          percentage?: number | null
          percentile?: number | null
          questions_attempted?: number | null
          quiz_id?: string | null
          rank_category?: number | null
          rank_overall?: number | null
          started_at?: string | null
          status?: string | null
          submitted_at?: string | null
          time_taken?: number | null
          total_marks?: number | null
          total_questions?: number | null
          unanswered?: number | null
          user_id?: string | null
        }
        Update: {
          attempt_number?: number | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          incorrect_answers?: number | null
          marks_obtained?: number | null
          percentage?: number | null
          percentile?: number | null
          questions_attempted?: number | null
          quiz_id?: string | null
          rank_category?: number | null
          rank_overall?: number | null
          started_at?: string | null
          status?: string | null
          submitted_at?: string | null
          time_taken?: number | null
          total_marks?: number | null
          total_questions?: number | null
          unanswered?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_categories: {
        Row: {
          category_type: string | null
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          id: string
          is_active: boolean | null
          name: string
          subject_id: string | null
        }
        Insert: {
          category_type?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          subject_id?: string | null
        }
        Update: {
          category_type?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_categories_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_question_options: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string
          image_url: string | null
          is_correct: boolean | null
          option_text: string
          question_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          option_text: string
          question_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          option_text?: string
          question_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          audio_url: string | null
          created_at: string | null
          difficulty_level: number | null
          estimated_time: number | null
          explanation: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          marks: number | null
          negative_marks: number | null
          question_text: string
          question_type: string | null
          quiz_id: string | null
          reference_links: string[] | null
          sort_order: number | null
          subtopic: string | null
          tags: string[] | null
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          estimated_time?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          marks?: number | null
          negative_marks?: number | null
          question_text: string
          question_type?: string | null
          quiz_id?: string | null
          reference_links?: string[] | null
          sort_order?: number | null
          subtopic?: string | null
          tags?: string[] | null
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          estimated_time?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          marks?: number | null
          negative_marks?: number | null
          question_text?: string
          question_type?: string | null
          quiz_id?: string | null
          reference_links?: string[] | null
          sort_order?: number | null
          subtopic?: string | null
          tags?: string[] | null
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          answered_at: string | null
          attempt_id: string | null
          confidence_level: number | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          marks_awarded: number | null
          numerical_response: number | null
          question_id: string | null
          reviewed_at: string | null
          selected_options: string[] | null
          text_response: string | null
          time_taken: number | null
        }
        Insert: {
          answered_at?: string | null
          attempt_id?: string | null
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          numerical_response?: number | null
          question_id?: string | null
          reviewed_at?: string | null
          selected_options?: string[] | null
          text_response?: string | null
          time_taken?: number | null
        }
        Update: {
          answered_at?: string | null
          attempt_id?: string | null
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          numerical_response?: number | null
          question_id?: string | null
          reviewed_at?: string | null
          selected_options?: string[] | null
          text_response?: string | null
          time_taken?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          allow_retake: boolean | null
          allow_review: boolean | null
          average_score: number | null
          category_id: string | null
          course_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          instructions: string | null
          is_featured: boolean | null
          is_free: boolean | null
          is_public: boolean | null
          max_attempts: number | null
          negative_marking: number | null
          option_randomization: boolean | null
          passing_marks: number | null
          price: number | null
          question_randomization: boolean | null
          requires_enrollment: boolean | null
          show_results_immediately: boolean | null
          start_date: string | null
          status: string | null
          subject_id: string | null
          time_limit: number | null
          title: string
          total_attempts: number | null
          total_marks: number | null
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          allow_retake?: boolean | null
          allow_review?: boolean | null
          average_score?: number | null
          category_id?: string | null
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          instructions?: string | null
          is_featured?: boolean | null
          is_free?: boolean | null
          is_public?: boolean | null
          max_attempts?: number | null
          negative_marking?: number | null
          option_randomization?: boolean | null
          passing_marks?: number | null
          price?: number | null
          question_randomization?: boolean | null
          requires_enrollment?: boolean | null
          show_results_immediately?: boolean | null
          start_date?: string | null
          status?: string | null
          subject_id?: string | null
          time_limit?: number | null
          title: string
          total_attempts?: number | null
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string | null
        }
        Update: {
          allow_retake?: boolean | null
          allow_review?: boolean | null
          average_score?: number | null
          category_id?: string | null
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          instructions?: string | null
          is_featured?: boolean | null
          is_free?: boolean | null
          is_public?: boolean | null
          max_attempts?: number | null
          negative_marking?: number | null
          option_randomization?: boolean | null
          passing_marks?: number | null
          price?: number | null
          question_randomization?: boolean | null
          requires_enrollment?: boolean | null
          show_results_immediately?: boolean | null
          start_date?: string | null
          status?: string | null
          subject_id?: string | null
          time_limit?: number | null
          title?: string
          total_attempts?: number | null
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          color_code: string | null
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          exam_type: string
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          code: string
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          exam_type: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          code?: string
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          exam_type?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          ai_quiz_generation: boolean | null
          created_at: string | null
          currency: string | null
          description: string | null
          display_name: string
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          max_courses: number | null
          max_flashcard_decks: number | null
          max_quiz_attempts_per_day: number | null
          name: string
          personal_mentor_access: boolean | null
          price_monthly: number | null
          price_yearly: number | null
          priority_support: boolean | null
          trial_period_days: number | null
          updated_at: string | null
        }
        Insert: {
          ai_quiz_generation?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          display_name: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_courses?: number | null
          max_flashcard_decks?: number | null
          max_quiz_attempts_per_day?: number | null
          name: string
          personal_mentor_access?: boolean | null
          price_monthly?: number | null
          price_yearly?: number | null
          priority_support?: boolean | null
          trial_period_days?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_quiz_generation?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          display_name?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_courses?: number | null
          max_flashcard_decks?: number | null
          max_quiz_attempts_per_day?: number | null
          name?: string
          personal_mentor_access?: boolean | null
          price_monthly?: number | null
          price_yearly?: number | null
          priority_support?: boolean | null
          trial_period_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_flashcard_progress: {
        Row: {
          average_response_time: number | null
          confidence_level: number | null
          difficulty_trend: string | null
          ease_factor: number | null
          flashcard_id: string | null
          hints_used: number | null
          id: string
          interval_days: number | null
          last_quality: number | null
          last_reviewed_at: string | null
          next_review_date: string | null
          repetitions: number | null
          success_rate: number | null
          successful_reviews: number | null
          total_reviews: number | null
          user_id: string | null
        }
        Insert: {
          average_response_time?: number | null
          confidence_level?: number | null
          difficulty_trend?: string | null
          ease_factor?: number | null
          flashcard_id?: string | null
          hints_used?: number | null
          id?: string
          interval_days?: number | null
          last_quality?: number | null
          last_reviewed_at?: string | null
          next_review_date?: string | null
          repetitions?: number | null
          success_rate?: number | null
          successful_reviews?: number | null
          total_reviews?: number | null
          user_id?: string | null
        }
        Update: {
          average_response_time?: number | null
          confidence_level?: number | null
          difficulty_trend?: string | null
          ease_factor?: number | null
          flashcard_id?: string | null
          hints_used?: number | null
          id?: string
          interval_days?: number | null
          last_quality?: number | null
          last_reviewed_at?: string | null
          next_review_date?: string | null
          repetitions?: number | null
          success_rate?: number | null
          successful_reviews?: number | null
          total_reviews?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_flashcard_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          notification_type: string
          priority: string | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          template_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type: string
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          template_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          template_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          daily_study_goal: number | null
          difficulty_preference: string | null
          id: string
          language: string | null
          notification_settings: Json | null
          preferred_study_time: string | null
          profile_visibility: string | null
          progress_sharing: boolean | null
          reminder_settings: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          daily_study_goal?: number | null
          difficulty_preference?: string | null
          id?: string
          language?: string | null
          notification_settings?: Json | null
          preferred_study_time?: string | null
          profile_visibility?: string | null
          progress_sharing?: boolean | null
          reminder_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          daily_study_goal?: number | null
          difficulty_preference?: string | null
          id?: string
          language?: string | null
          notification_settings?: Json | null
          preferred_study_time?: string | null
          profile_visibility?: string | null
          progress_sharing?: boolean | null
          reminder_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_study_analytics: {
        Row: {
          average_quiz_score: number | null
          created_at: string | null
          daily_goal_met: boolean | null
          date: string
          flashcard_retention_rate: number | null
          flashcard_study_time: number | null
          flashcards_reviewed: number | null
          id: string
          lessons_completed: number | null
          notes_created: number | null
          quiz_time: number | null
          quizzes_attempted: number | null
          study_streak: number | null
          total_study_time: number | null
          user_id: string | null
          video_watch_time: number | null
        }
        Insert: {
          average_quiz_score?: number | null
          created_at?: string | null
          daily_goal_met?: boolean | null
          date: string
          flashcard_retention_rate?: number | null
          flashcard_study_time?: number | null
          flashcards_reviewed?: number | null
          id?: string
          lessons_completed?: number | null
          notes_created?: number | null
          quiz_time?: number | null
          quizzes_attempted?: number | null
          study_streak?: number | null
          total_study_time?: number | null
          user_id?: string | null
          video_watch_time?: number | null
        }
        Update: {
          average_quiz_score?: number | null
          created_at?: string | null
          daily_goal_met?: boolean | null
          date?: string
          flashcard_retention_rate?: number | null
          flashcard_study_time?: number | null
          flashcards_reviewed?: number | null
          id?: string
          lessons_completed?: number | null
          notes_created?: number | null
          quiz_time?: number | null
          quizzes_attempted?: number | null
          study_streak?: number | null
          total_study_time?: number | null
          user_id?: string | null
          video_watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_study_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          amount_paid: number | null
          auto_renewal: boolean | null
          billing_cycle: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_trial: boolean | null
          payment_gateway: string | null
          payment_method: string | null
          payment_reference: string | null
          plan_id: string | null
          started_at: string | null
          status: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          auto_renewal?: boolean | null
          billing_cycle?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          auto_renewal?: boolean | null
          billing_cycle?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_preparation_level: string | null
          email: string
          email_verified: boolean | null
          exam_target: string | null
          id: string
          last_login_at: string | null
          location: string | null
          name: string
          phone: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          role: string | null
          study_goals: string | null
          subscription_tier: string | null
          target_exam_date: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          account_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_preparation_level?: string | null
          email: string
          email_verified?: boolean | null
          exam_target?: string | null
          id?: string
          last_login_at?: string | null
          location?: string | null
          name: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          role?: string | null
          study_goals?: string | null
          subscription_tier?: string | null
          target_exam_date?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          account_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_preparation_level?: string | null
          email?: string
          email_verified?: boolean | null
          exam_target?: string | null
          id?: string
          last_login_at?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          role?: string | null
          study_goals?: string | null
          subscription_tier?: string | null
          target_exam_date?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      enrollment_status: "PENDING" | "PAID" | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      enrollment_status: ["PENDING", "PAID", "CANCELLED"],
    },
  },
} as const
