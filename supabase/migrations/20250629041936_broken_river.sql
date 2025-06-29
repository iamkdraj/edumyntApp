/*
  # Core Database Schema for EDUMYNT Learning Platform

  1. New Tables
    - `profiles` - User profile information
    - `courses` - Course catalog
    - `lessons` - Individual lessons within courses
    - `tests` - Test/quiz definitions
    - `questions` - Question bank
    - `user_enrollments` - Course enrollment tracking
    - `lesson_progress` - User lesson completion tracking
    - `test_attempts` - User test attempt records
    - `user_answers` - Individual question responses
    - `notes` - Course notes and materials
    - `bookmarks` - User bookmarks
    - `discussions` - Discussion threads
    - `discussion_replies` - Discussion replies
    - `ai_interactions` - AI chat history

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
    - Secure admin-only operations

  3. Features
    - Course enrollment system
    - Progress tracking
    - Test/quiz system with detailed analytics
    - Discussion system
    - AI interaction logging
    - Bookmark system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'admin', 'instructor');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'interactive');
CREATE TYPE question_type AS ENUM ('mcq', 'multiple_select', 'fill_blank', 'drag_drop', 'match');
CREATE TYPE test_type AS ENUM ('lesson_quiz', 'topic_test', 'mock_test', 'practice');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  role user_role DEFAULT 'student',
  is_public boolean DEFAULT false,
  streak_count integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  thumbnail_url text,
  status course_status DEFAULT 'draft',
  is_free boolean DEFAULT true,
  price decimal(10,2) DEFAULT 0,
  preview_enabled boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  lesson_type lesson_type DEFAULT 'text',
  order_index integer NOT NULL,
  is_preview boolean DEFAULT false,
  estimated_duration integer DEFAULT 0, -- in minutes
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  test_type test_type DEFAULT 'practice',
  time_limit integer, -- in minutes
  total_questions integer DEFAULT 0,
  is_preview boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type question_type DEFAULT 'mcq',
  options jsonb, -- Store options as JSON array
  correct_answers jsonb, -- Store correct answers as JSON array
  explanation text,
  explanation_video_url text,
  difficulty_level integer DEFAULT 1, -- 1-5 scale
  tags text[] DEFAULT '{}',
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User enrollments
CREATE TABLE IF NOT EXISTS user_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  time_spent integer DEFAULT 0, -- in seconds
  last_position integer DEFAULT 0, -- for video/content position
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Test attempts
CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  total_questions integer NOT NULL,
  correct_answers integer DEFAULT 0,
  time_taken integer, -- in seconds
  completed boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- User answers for each question
CREATE TABLE IF NOT EXISTS user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  user_answer jsonb, -- Store user's answer(s)
  is_correct boolean DEFAULT false,
  time_taken integer, -- in seconds
  created_at timestamptz DEFAULT now()
);

-- Notes and materials
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text,
  file_url text,
  file_type text,
  is_public boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Discussion threads
CREATE TABLE IF NOT EXISTS discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Discussion replies
CREATE TABLE IF NOT EXISTS discussion_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_solution boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI interactions log
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  question_id uuid REFERENCES questions(id) ON DELETE SET NULL,
  query text NOT NULL,
  response text NOT NULL,
  interaction_type text DEFAULT 'general', -- 'lesson_help', 'test_explanation', 'general'
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (status = 'published' OR auth.uid() = created_by);

CREATE POLICY "Admins and instructors can manage courses"
  ON courses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'instructor')
    )
  );

-- Lessons policies
CREATE POLICY "Users can view lessons from enrolled courses or previews"
  ON lessons FOR SELECT
  TO authenticated
  USING (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM user_enrollments ue
      JOIN courses c ON c.id = ue.course_id
      WHERE ue.user_id = auth.uid() 
      AND c.id = course_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Admins and instructors can manage lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'instructor')
    )
  );

-- Tests policies
CREATE POLICY "Users can view tests from enrolled courses or previews"
  ON tests FOR SELECT
  TO authenticated
  USING (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM user_enrollments ue
      JOIN courses c ON c.id = ue.course_id
      WHERE ue.user_id = auth.uid() 
      AND c.id = course_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

-- Questions policies
CREATE POLICY "Users can view questions from accessible tests"
  ON questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tests t
      WHERE t.id = test_id
      AND (
        t.is_preview = true OR
        EXISTS (
          SELECT 1 FROM user_enrollments ue
          JOIN courses c ON c.id = ue.course_id
          WHERE ue.user_id = auth.uid() 
          AND c.id = t.course_id
        )
      )
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

-- User enrollments policies
CREATE POLICY "Users can view own enrollments"
  ON user_enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can enroll themselves"
  ON user_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Lesson progress policies
CREATE POLICY "Users can manage own progress"
  ON lesson_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Test attempts policies
CREATE POLICY "Users can manage own test attempts"
  ON test_attempts FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User answers policies
CREATE POLICY "Users can manage own answers"
  ON user_answers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts ta
      WHERE ta.id = attempt_id 
      AND ta.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM test_attempts ta
      WHERE ta.id = attempt_id 
      AND ta.user_id = auth.uid()
    )
  );

-- Notes policies
CREATE POLICY "Users can view public notes or from enrolled courses"
  ON notes FOR SELECT
  TO authenticated
  USING (
    is_public = true OR
    EXISTS (
      SELECT 1 FROM user_enrollments ue
      WHERE ue.user_id = auth.uid() 
      AND ue.course_id = course_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

-- Bookmarks policies
CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Discussions policies
CREATE POLICY "Users can view discussions from enrolled courses"
  ON discussions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN user_enrollments ue ON ue.course_id = l.course_id
      WHERE l.id = lesson_id 
      AND ue.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Users can create discussions"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Discussion replies policies
CREATE POLICY "Users can view replies from accessible discussions"
  ON discussion_replies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM discussions d
      JOIN lessons l ON l.id = d.lesson_id
      JOIN user_enrollments ue ON ue.course_id = l.course_id
      WHERE d.id = discussion_id 
      AND ue.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Users can create replies"
  ON discussion_replies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own replies"
  ON discussion_replies FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- AI interactions policies
CREATE POLICY "Users can manage own AI interactions"
  ON ai_interactions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tests_course_id ON tests(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions(test_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(test_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user_id ON user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_course_id ON user_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_attempt_id ON user_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_discussions_lesson_id ON discussions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON discussion_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();