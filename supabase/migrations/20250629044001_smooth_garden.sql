/*
  # Fix SQL syntax error in sample data

  This migration fixes the unterminated quoted string error by correcting
  the PostgreSQL array syntax for the tags column.
*/

-- Insert sample courses with proper UUIDs
INSERT INTO courses (id, title, description, subject, status, is_free, preview_enabled, created_by) VALUES
  (
    gen_random_uuid(),
    'English Grammar Fundamentals',
    'Master the basics of English grammar with comprehensive lessons covering parts of speech, sentence structure, and common grammar rules.',
    'English',
    'published',
    true,
    true,
    NULL
  ),
  (
    gen_random_uuid(),
    'Educational Psychology Basics',
    'Understanding learning theories, cognitive development, and educational psychology principles for teaching and learning.',
    'Psychology',
    'published',
    false,
    true,
    NULL
  );

-- Get the course IDs for reference
DO $$
DECLARE
    english_course_id uuid;
    psychology_course_id uuid;
    lesson_nouns_id uuid;
    lesson_verbs_id uuid;
    lesson_adjectives_id uuid;
    lesson_learning_id uuid;
    test_nouns_id uuid;
    test_mock_id uuid;
BEGIN
    -- Get course IDs
    SELECT id INTO english_course_id FROM courses WHERE title = 'English Grammar Fundamentals';
    SELECT id INTO psychology_course_id FROM courses WHERE title = 'Educational Psychology Basics';
    
    -- Generate lesson IDs
    lesson_nouns_id := gen_random_uuid();
    lesson_verbs_id := gen_random_uuid();
    lesson_adjectives_id := gen_random_uuid();
    lesson_learning_id := gen_random_uuid();
    
    -- Insert sample lessons for English course
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        lesson_nouns_id,
        english_course_id,
        'Introduction to Nouns',
        '# Introduction to Nouns

A noun is a word that names a person, place, thing, or idea. Nouns are one of the most important parts of speech in English.

## Types of Nouns

### 1. Common Nouns
Common nouns name general items, not specific ones.
- Examples: dog, city, book, happiness

### 2. Proper Nouns
Proper nouns name specific people, places, or things and are always capitalized.
- Examples: John, London, Bible, Christmas

### 3. Concrete Nouns
Concrete nouns name things you can see, hear, smell, taste, or touch.
- Examples: apple, music, perfume, cake, silk

### 4. Abstract Nouns
Abstract nouns name ideas, emotions, or concepts that cannot be perceived by the senses.
- Examples: love, freedom, intelligence, courage

## Practice Exercise
Identify the nouns in these sentences:
1. The teacher gave the students homework.
2. Sarah visited Paris last summer.
3. His kindness impressed everyone.',
        'text',
        1,
        true,
        15
      ),
      (
        lesson_verbs_id,
        english_course_id,
        'Understanding Verbs',
        '# Understanding Verbs

A verb is a word that expresses action, occurrence, or state of being. Every complete sentence must have at least one verb.

## Types of Verbs

### 1. Action Verbs
Action verbs express physical or mental action.
- Physical: run, jump, write, eat
- Mental: think, believe, remember, understand

### 2. Linking Verbs
Linking verbs connect the subject to additional information about the subject.
- Common linking verbs: be, seem, appear, become, feel, look, sound, taste

### 3. Helping Verbs (Auxiliary Verbs)
Helping verbs work with main verbs to form verb phrases.
- Examples: am, is, are, was, were, have, has, had, will, would, can, could

## Verb Tenses
Verbs change form to show when an action happens:
- Present: I walk
- Past: I walked  
- Future: I will walk

## Practice
Identify the verbs in these sentences:
1. She is reading a book.
2. They have finished their work.
3. The dog barked loudly.',
        'text',
        2,
        false,
        20
      ),
      (
        lesson_adjectives_id,
        english_course_id,
        'Adjectives and Descriptions',
        '# Adjectives and Descriptions

An adjective is a word that describes or modifies a noun or pronoun. Adjectives make our writing more interesting and precise.

## What Adjectives Do
- Describe qualities: beautiful, ugly, smart, funny
- Indicate size: big, small, tiny, huge
- Show age: young, old, new, ancient
- Express color: red, blue, green, colorful
- Indicate origin: American, Chinese, European

## Position of Adjectives
Adjectives usually come before the noun they modify:
- A **red** car
- The **intelligent** student
- **Fresh** bread

Sometimes adjectives come after linking verbs:
- The car is **red**.
- The student seems **intelligent**.
- The bread smells **fresh**.

## Comparative and Superlative Forms
- Positive: tall, beautiful, good
- Comparative: taller, more beautiful, better
- Superlative: tallest, most beautiful, best

## Practice Exercise
Add appropriate adjectives to these sentences:
1. The ___ dog ran through the ___ park.
2. She wore a ___ dress to the ___ party.
3. The ___ mountain looked ___ in the morning light.',
        'text',
        3,
        false,
        18
      );

    -- Insert sample lessons for Psychology course
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        lesson_learning_id,
        psychology_course_id,
        'Major Learning Theories',
        '# Major Learning Theories

Understanding how people learn is fundamental to effective teaching. Here are the major learning theories that shape modern education.

## 1. Behaviorism
Behaviorism focuses on observable behaviors and the responses to environmental stimuli.

### Key Principles:
- Learning occurs through conditioning
- Reinforcement strengthens behavior
- Punishment weakens behavior
- Environment shapes behavior

### Key Figures:
- **B.F. Skinner**: Operant conditioning
- **Ivan Pavlov**: Classical conditioning
- **John Watson**: Founder of behaviorism

### Applications in Education:
- Reward systems and positive reinforcement
- Clear rules and consequences
- Structured learning environments

## 2. Cognitivism
Cognitivism focuses on mental processes and how information is processed, stored, and retrieved.

### Key Principles:
- Learning involves mental processes
- Prior knowledge affects new learning
- Memory and attention are crucial
- Learning is an active process

### Key Figures:
- **Jean Piaget**: Cognitive development stages
- **Jerome Bruner**: Discovery learning
- **David Ausubel**: Meaningful learning

### Applications in Education:
- Scaffolding and guided discovery
- Connecting new information to prior knowledge
- Organizing information logically

## 3. Constructivism
Constructivism suggests that learners actively construct their own understanding through experience.

### Key Principles:
- Knowledge is constructed by the learner
- Learning is an active, social process
- Context and culture matter
- Multiple perspectives are valuable

### Key Figures:
- **Lev Vygotsky**: Social constructivism
- **John Dewey**: Learning by doing
- **Maria Montessori**: Child-centered learning

### Applications in Education:
- Project-based learning
- Collaborative learning
- Real-world problem solving
- Student-centered approaches',
        'text',
        1,
        true,
        25
      );

    -- Generate test IDs
    test_nouns_id := gen_random_uuid();
    test_mock_id := gen_random_uuid();

    -- Insert sample tests
    INSERT INTO tests (id, course_id, title, description, test_type, time_limit, total_questions, is_preview) VALUES
      (
        test_nouns_id,
        english_course_id,
        'Nouns Knowledge Check',
        'Test your understanding of different types of nouns and their usage.',
        'lesson_quiz',
        10,
        5,
        true
      ),
      (
        test_mock_id,
        english_course_id,
        'English Grammar Mock Test',
        'Comprehensive test covering nouns, verbs, and adjectives.',
        'mock_test',
        30,
        15,
        false
      );

    -- Insert sample questions for nouns quiz
    INSERT INTO questions (id, test_id, question_text, question_type, options, correct_answers, explanation, difficulty_level, tags, order_index) VALUES
      (
        gen_random_uuid(),
        test_nouns_id,
        'Which of the following is a proper noun?',
        'mcq',
        '["dog", "London", "happiness", "book"]',
        '["London"]',
        'London is a proper noun because it names a specific place and is capitalized. The other options are common nouns (dog, book) or abstract nouns (happiness).',
        1,
        ARRAY['nouns', 'proper nouns'],
        1
      ),
      (
        gen_random_uuid(),
        test_nouns_id,
        'Identify the abstract noun in this sentence: "Her kindness impressed everyone."',
        'mcq',
        '["Her", "kindness", "impressed", "everyone"]',
        '["kindness"]',
        'Kindness is an abstract noun because it represents a quality or concept that cannot be perceived by the physical senses.',
        2,
        ARRAY['nouns', 'abstract nouns'],
        2
      ),
      (
        gen_random_uuid(),
        test_nouns_id,
        'How many nouns are in this sentence: "The teacher gave the students homework."?',
        'mcq',
        '["2", "3", "4", "5"]',
        '["3"]',
        'There are 3 nouns in the sentence: "teacher", "students", and "homework". All three name people or things.',
        2,
        ARRAY['nouns', 'identification'],
        3
      ),
      (
        gen_random_uuid(),
        test_nouns_id,
        'Which of these nouns is concrete?',
        'mcq',
        '["freedom", "apple", "love", "intelligence"]',
        '["apple"]',
        'Apple is a concrete noun because it can be perceived by the senses (you can see, touch, taste, and smell an apple). The others are abstract nouns representing concepts or emotions.',
        1,
        ARRAY['nouns', 'concrete nouns', 'abstract nouns'],
        4
      ),
      (
        gen_random_uuid(),
        test_nouns_id,
        'What is the plural form of "child"?',
        'mcq',
        '["childs", "children", "childes", "child"]',
        '["children"]',
        'The plural of "child" is "children". This is an irregular plural form that doesn''t follow the standard rule of adding -s or -es.',
        2,
        ARRAY['nouns', 'plural forms', 'irregular plurals'],
        5
      );

    -- Insert sample notes
    INSERT INTO notes (id, course_id, title, content, is_public, tags) VALUES
      (
        gen_random_uuid(),
        english_course_id,
        'English Grammar Quick Reference',
        '# English Grammar Quick Reference

## Parts of Speech Summary

### Nouns
- Person, place, thing, or idea
- Common vs. Proper
- Concrete vs. Abstract
- Singular vs. Plural

### Verbs  
- Action, linking, or helping
- Present, past, future tenses
- Regular vs. irregular forms

### Adjectives
- Describe or modify nouns
- Comparative and superlative forms
- Position before nouns or after linking verbs

### Adverbs
- Modify verbs, adjectives, or other adverbs
- Often end in -ly
- Answer how, when, where, why

## Common Grammar Rules

1. **Subject-Verb Agreement**: Singular subjects take singular verbs
2. **Apostrophes**: Show possession or contractions
3. **Capitalization**: Proper nouns, sentence beginnings
4. **Punctuation**: Periods, commas, question marks

## Memory Tips

- **Noun test**: Can you put "a" or "the" in front of it?
- **Verb test**: Can you add -ing to it?
- **Adjective test**: Does it answer "what kind" or "which one"?',
        true,
        ARRAY['grammar', 'reference', 'parts of speech']
      );
END $$;