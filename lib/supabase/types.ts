export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'student' | 'admin' | 'instructor'
          is_public: boolean
          streak_count: number
          last_activity_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'student' | 'admin' | 'instructor'
          is_public?: boolean
          streak_count?: number
          last_activity_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'student' | 'admin' | 'instructor'
          is_public?: boolean
          streak_count?: number
          last_activity_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          subject: string
          thumbnail_url: string | null
          status: 'draft' | 'published' | 'archived'
          is_free: boolean
          price: number
          preview_enabled: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          subject: string
          thumbnail_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_free?: boolean
          price?: number
          preview_enabled?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          subject?: string
          thumbnail_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_free?: boolean
          price?: number
          preview_enabled?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          video_url: string | null
          lesson_type: 'video' | 'text' | 'interactive'
          order_index: number
          is_preview: boolean
          estimated_duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          video_url?: string | null
          lesson_type?: 'video' | 'text' | 'interactive'
          order_index: number
          is_preview?: boolean
          estimated_duration?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          lesson_type?: 'video' | 'text' | 'interactive'
          order_index?: number
          is_preview?: boolean
          estimated_duration?: number
          created_at?: string
          updated_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          course_id: string
          lesson_id: string | null
          title: string
          description: string | null
          test_type: 'lesson_quiz' | 'topic_test' | 'mock_test' | 'practice'
          time_limit: number | null
          total_questions: number
          is_preview: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          lesson_id?: string | null
          title: string
          description?: string | null
          test_type?: 'lesson_quiz' | 'topic_test' | 'mock_test' | 'practice'
          time_limit?: number | null
          total_questions?: number
          is_preview?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          lesson_id?: string | null
          title?: string
          description?: string | null
          test_type?: 'lesson_quiz' | 'topic_test' | 'mock_test' | 'practice'
          time_limit?: number | null
          total_questions?: number
          is_preview?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          test_id: string
          question_text: string
          question_type: 'mcq' | 'multiple_select' | 'fill_blank' | 'drag_drop' | 'match'
          options: Json | null
          correct_answers: Json | null
          explanation: string | null
          explanation_video_url: string | null
          difficulty_level: number
          tags: string[]
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          test_id: string
          question_text: string
          question_type?: 'mcq' | 'multiple_select' | 'fill_blank' | 'drag_drop' | 'match'
          options?: Json | null
          correct_answers?: Json | null
          explanation?: string | null
          explanation_video_url?: string | null
          difficulty_level?: number
          tags?: string[]
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          question_text?: string
          question_type?: 'mcq' | 'multiple_select' | 'fill_blank' | 'drag_drop' | 'match'
          options?: Json | null
          correct_answers?: Json | null
          explanation?: string | null
          explanation_video_url?: string | null
          difficulty_level?: number
          tags?: string[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          time_spent: number
          last_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          time_spent?: number
          last_position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          time_spent?: number
          last_position?: number
          created_at?: string
          updated_at?: string
        }
      }
      test_attempts: {
        Row: {
          id: string
          user_id: string
          test_id: string
          score: number
          total_questions: number
          correct_answers: number
          time_taken: number | null
          completed: boolean
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          score?: number
          total_questions: number
          correct_answers?: number
          time_taken?: number | null
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          test_id?: string
          score?: number
          total_questions?: number
          correct_answers?: number
          time_taken?: number | null
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
      }
      user_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          user_answer: Json | null
          is_correct: boolean
          time_taken: number | null
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          user_answer?: Json | null
          is_correct?: boolean
          time_taken?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          user_answer?: Json | null
          is_correct?: boolean
          time_taken?: number | null
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          course_id: string
          lesson_id: string | null
          title: string
          content: string | null
          file_url: string | null
          file_type: string | null
          is_public: boolean
          tags: string[]
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          lesson_id?: string | null
          title: string
          content?: string | null
          file_url?: string | null
          file_type?: string | null
          is_public?: boolean
          tags?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          lesson_id?: string | null
          title?: string
          content?: string | null
          file_url?: string | null
          file_type?: string | null
          is_public?: boolean
          tags?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          note?: string | null
          created_at?: string
        }
      }
      discussions: {
        Row: {
          id: string
          lesson_id: string | null
          question_id: string | null
          user_id: string
          title: string | null
          content: string
          is_resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id?: string | null
          question_id?: string | null
          user_id: string
          title?: string | null
          content: string
          is_resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string | null
          question_id?: string | null
          user_id?: string
          title?: string | null
          content?: string
          is_resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      discussion_replies: {
        Row: {
          id: string
          discussion_id: string
          user_id: string
          content: string
          is_solution: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          discussion_id: string
          user_id: string
          content: string
          is_solution?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          discussion_id?: string
          user_id?: string
          content?: string
          is_solution?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          lesson_id: string | null
          question_id: string | null
          query: string
          response: string
          interaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id?: string | null
          question_id?: string | null
          query: string
          response: string
          interaction_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string | null
          question_id?: string | null
          query?: string
          response?: string
          interaction_type?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'admin' | 'instructor'
      course_status: 'draft' | 'published' | 'archived'
      lesson_type: 'video' | 'text' | 'interactive'
      question_type: 'mcq' | 'multiple_select' | 'fill_blank' | 'drag_drop' | 'match'
      test_type: 'lesson_quiz' | 'topic_test' | 'mock_test' | 'practice'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}