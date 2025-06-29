/*
  # Add Course Modules/Sections Support

  1. New Tables
    - `course_modules` - Course sections/modules
    - Update lessons to reference modules

  2. Features
    - Hierarchical course structure
    - Module-based organization
    - Order management
    - Progress tracking per module

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  is_preview boolean DEFAULT false,
  estimated_duration integer DEFAULT 0, -- in minutes
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add module reference to lessons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lessons' AND column_name = 'module_id'
  ) THEN
    ALTER TABLE lessons ADD COLUMN module_id uuid REFERENCES course_modules(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_modules
CREATE POLICY "Users can view modules from enrolled courses or previews"
  ON course_modules FOR SELECT
  TO authenticated
  USING (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM user_enrollments ue
      WHERE ue.user_id = auth.uid() 
      AND ue.course_id = course_modules.course_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Admins and instructors can manage modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'instructor')
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);

-- Create trigger for updated_at
CREATE TRIGGER update_course_modules_updated_at 
  BEFORE UPDATE ON course_modules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample modules for existing courses
DO $$
DECLARE
    english_course_id uuid;
    psychology_course_id uuid;
    math_course_id uuid;
    science_course_id uuid;
    history_course_id uuid;
    current_affairs_course_id uuid;
    reasoning_course_id uuid;
    
    english_module1_id uuid;
    english_module2_id uuid;
    psychology_module1_id uuid;
    math_module1_id uuid;
    science_module1_id uuid;
    history_module1_id uuid;
    current_affairs_module1_id uuid;
    reasoning_module1_id uuid;
BEGIN
    -- Get course IDs
    SELECT id INTO english_course_id FROM courses WHERE title = 'English Grammar Fundamentals';
    SELECT id INTO psychology_course_id FROM courses WHERE title = 'Educational Psychology Basics';
    SELECT id INTO math_course_id FROM courses WHERE title = 'Mathematics Fundamentals';
    SELECT id INTO science_course_id FROM courses WHERE title = 'General Science Basics';
    SELECT id INTO history_course_id FROM courses WHERE title = 'Indian History Overview';
    SELECT id INTO current_affairs_course_id FROM courses WHERE title = 'Current Affairs & General Knowledge';
    SELECT id INTO reasoning_course_id FROM courses WHERE title = 'Reasoning & Logical Thinking';
    
    -- Generate module IDs
    english_module1_id := gen_random_uuid();
    english_module2_id := gen_random_uuid();
    psychology_module1_id := gen_random_uuid();
    math_module1_id := gen_random_uuid();
    science_module1_id := gen_random_uuid();
    history_module1_id := gen_random_uuid();
    current_affairs_module1_id := gen_random_uuid();
    reasoning_module1_id := gen_random_uuid();
    
    -- Insert modules for English course
    INSERT INTO course_modules (id, course_id, title, description, order_index, is_preview, estimated_duration) VALUES
      (
        english_module1_id,
        english_course_id,
        'Parts of Speech',
        'Learn about nouns, verbs, adjectives, and other fundamental parts of speech',
        1,
        true,
        60
      ),
      (
        english_module2_id,
        english_course_id,
        'Sentence Structure',
        'Understanding how to construct proper sentences and avoid common errors',
        2,
        false,
        45
      );
    
    -- Insert modules for other courses
    INSERT INTO course_modules (id, course_id, title, description, order_index, is_preview, estimated_duration) VALUES
      (
        psychology_module1_id,
        psychology_course_id,
        'Learning Theories',
        'Explore major learning theories and their applications in education',
        1,
        true,
        50
      ),
      (
        math_module1_id,
        math_course_id,
        'Number Systems',
        'Master different number systems and basic mathematical operations',
        1,
        true,
        45
      ),
      (
        science_module1_id,
        science_course_id,
        'Scientific Method',
        'Understanding the scientific method and basic principles of science',
        1,
        true,
        55
      ),
      (
        history_module1_id,
        history_course_id,
        'Ancient Civilizations',
        'Journey through ancient Indian civilizations and their contributions',
        1,
        true,
        65
      ),
      (
        current_affairs_module1_id,
        current_affairs_course_id,
        'Indian Constitution',
        'Understanding the Indian Constitution and government structure',
        1,
        true,
        70
      ),
      (
        reasoning_module1_id,
        reasoning_course_id,
        'Logical Reasoning Basics',
        'Fundamentals of logical reasoning and problem-solving techniques',
        1,
        true,
        55
      );
    
    -- Update existing lessons to reference modules
    UPDATE lessons 
    SET module_id = english_module1_id 
    WHERE course_id = english_course_id;
    
    UPDATE lessons 
    SET module_id = psychology_module1_id 
    WHERE course_id = psychology_course_id;
    
    UPDATE lessons 
    SET module_id = math_module1_id 
    WHERE course_id = math_course_id;
    
    UPDATE lessons 
    SET module_id = science_module1_id 
    WHERE course_id = science_course_id;
    
    UPDATE lessons 
    SET module_id = history_module1_id 
    WHERE course_id = history_course_id;
    
    UPDATE lessons 
    SET module_id = current_affairs_module1_id 
    WHERE course_id = current_affairs_course_id;
    
    UPDATE lessons 
    SET module_id = reasoning_module1_id 
    WHERE course_id = reasoning_course_id;
END $$;