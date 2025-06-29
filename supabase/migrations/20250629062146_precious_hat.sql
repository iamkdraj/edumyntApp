/*
  # Add More Demo Courses and Content

  1. New Courses
    - Mathematics Fundamentals
    - General Science Basics
    - Indian History Overview
    - Current Affairs & GK
    - Reasoning & Logic

  2. Each course includes:
    - Course details with proper subjects
    - One comprehensive lesson per course
    - Sample tests and questions
    - Notes and materials

  3. All courses are published and have preview enabled
*/

-- Insert 5 additional demo courses
INSERT INTO courses (id, title, description, subject, status, is_free, preview_enabled, created_by) VALUES
  (
    gen_random_uuid(),
    'Mathematics Fundamentals',
    'Build a strong foundation in mathematics covering arithmetic, algebra, geometry, and basic statistics essential for competitive exams.',
    'Mathematics',
    'published',
    true,
    true,
    NULL
  ),
  (
    gen_random_uuid(),
    'General Science Basics',
    'Comprehensive coverage of Physics, Chemistry, and Biology fundamentals with focus on scientific principles and applications.',
    'Science',
    'published',
    false,
    true,
    NULL
  ),
  (
    gen_random_uuid(),
    'Indian History Overview',
    'Journey through Indian history from ancient civilizations to modern India, covering major events, personalities, and cultural developments.',
    'History',
    'published',
    true,
    true,
    NULL
  ),
  (
    gen_random_uuid(),
    'Current Affairs & General Knowledge',
    'Stay updated with latest current affairs, important events, and general knowledge topics relevant for government exams.',
    'Current Affairs',
    'published',
    false,
    true,
    NULL
  ),
  (
    gen_random_uuid(),
    'Reasoning & Logical Thinking',
    'Develop analytical and logical reasoning skills with practice in verbal reasoning, non-verbal reasoning, and analytical ability.',
    'Reasoning',
    'published',
    true,
    true,
    NULL
  );

-- Add lessons for each new course
DO $$
DECLARE
    math_course_id uuid;
    science_course_id uuid;
    history_course_id uuid;
    current_affairs_course_id uuid;
    reasoning_course_id uuid;
    
    math_lesson_id uuid;
    science_lesson_id uuid;
    history_lesson_id uuid;
    current_affairs_lesson_id uuid;
    reasoning_lesson_id uuid;
    
    math_test_id uuid;
    science_test_id uuid;
    history_test_id uuid;
    current_affairs_test_id uuid;
    reasoning_test_id uuid;
BEGIN
    -- Get course IDs
    SELECT id INTO math_course_id FROM courses WHERE title = 'Mathematics Fundamentals';
    SELECT id INTO science_course_id FROM courses WHERE title = 'General Science Basics';
    SELECT id INTO history_course_id FROM courses WHERE title = 'Indian History Overview';
    SELECT id INTO current_affairs_course_id FROM courses WHERE title = 'Current Affairs & General Knowledge';
    SELECT id INTO reasoning_course_id FROM courses WHERE title = 'Reasoning & Logical Thinking';
    
    -- Generate lesson IDs
    math_lesson_id := gen_random_uuid();
    science_lesson_id := gen_random_uuid();
    history_lesson_id := gen_random_uuid();
    current_affairs_lesson_id := gen_random_uuid();
    reasoning_lesson_id := gen_random_uuid();
    
    -- Insert Mathematics lesson
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        math_lesson_id,
        math_course_id,
        'Number Systems and Basic Operations',
        '# Number Systems and Basic Operations

Mathematics forms the backbone of logical thinking and problem-solving. Let''s start with the fundamental concepts of number systems.

## Types of Numbers

### 1. Natural Numbers (N)
Natural numbers are counting numbers starting from 1.
- Set: {1, 2, 3, 4, 5, ...}
- Used for counting objects
- Always positive

### 2. Whole Numbers (W)
Whole numbers include natural numbers plus zero.
- Set: {0, 1, 2, 3, 4, 5, ...}
- Zero is the additive identity

### 3. Integers (Z)
Integers include positive numbers, negative numbers, and zero.
- Set: {..., -3, -2, -1, 0, 1, 2, 3, ...}
- Positive integers: {1, 2, 3, ...}
- Negative integers: {..., -3, -2, -1}

### 4. Rational Numbers (Q)
Numbers that can be expressed as p/q where p and q are integers and q ≠ 0.
- Examples: 1/2, -3/4, 5, 0.75
- Include terminating and repeating decimals

### 5. Irrational Numbers
Numbers that cannot be expressed as a simple fraction.
- Examples: π, √2, √3, e
- Have non-terminating, non-repeating decimal expansions

## Basic Operations

### Order of Operations (BODMAS/PEMDAS)
1. **B**rackets/Parentheses
2. **O**rders/Exponents
3. **D**ivision and **M**ultiplication (left to right)
4. **A**ddition and **S**ubtraction (left to right)

### Properties of Operations

#### Commutative Property
- Addition: a + b = b + a
- Multiplication: a × b = b × a

#### Associative Property
- Addition: (a + b) + c = a + (b + c)
- Multiplication: (a × b) × c = a × (b × c)

#### Distributive Property
- a × (b + c) = (a × b) + (a × c)

## Practice Problems

1. Simplify: 15 + 3 × 4 - 2²
2. Find the value: (8 + 2) × 3 ÷ 5
3. Classify the following numbers:
   - 7 (Natural, Whole, Integer, Rational)
   - -5 (Integer, Rational)
   - 0.333... (Rational)
   - √7 (Irrational)

## Key Formulas to Remember

- **Average**: Sum of all values ÷ Number of values
- **Percentage**: (Part/Whole) × 100
- **Simple Interest**: (Principal × Rate × Time) ÷ 100
- **Compound Interest**: P(1 + r/100)ⁿ - P

Understanding these fundamentals will help you tackle more complex mathematical problems in competitive exams.',
        'text',
        1,
        true,
        30
      );

    -- Insert Science lesson
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        science_lesson_id,
        science_course_id,
        'Scientific Method and Basic Principles',
        '# Scientific Method and Basic Principles

Science is the systematic study of the natural world through observation, experimentation, and analysis. Let''s explore the fundamental principles that govern scientific inquiry.

## The Scientific Method

### 1. Observation
- Careful watching and recording of natural phenomena
- Use of senses and instruments to gather data
- Objective and unbiased recording

### 2. Question Formation
- Asking specific, testable questions about observations
- Questions should be clear and focused
- Must be answerable through experimentation

### 3. Hypothesis
- Educated guess or prediction about the answer
- Must be testable and falsifiable
- Based on existing knowledge and observations

### 4. Experimentation
- Controlled tests to verify or refute the hypothesis
- Variables: Independent, Dependent, and Controlled
- Repeated trials for reliability

### 5. Analysis and Conclusion
- Interpretation of experimental results
- Support or rejection of hypothesis
- Formation of theories and laws

## Basic Physics Principles

### Motion and Force
- **Newton''s First Law**: Object at rest stays at rest, object in motion stays in motion
- **Newton''s Second Law**: F = ma (Force = mass × acceleration)
- **Newton''s Third Law**: For every action, there''s an equal and opposite reaction

### Energy
- **Kinetic Energy**: Energy of motion (KE = ½mv²)
- **Potential Energy**: Stored energy (PE = mgh)
- **Conservation of Energy**: Energy cannot be created or destroyed

## Basic Chemistry Concepts

### Atomic Structure
- **Protons**: Positive charge, in nucleus
- **Neutrons**: No charge, in nucleus
- **Electrons**: Negative charge, orbit nucleus

### Chemical Bonds
- **Ionic Bonds**: Transfer of electrons
- **Covalent Bonds**: Sharing of electrons
- **Metallic Bonds**: Sea of electrons

### States of Matter
- **Solid**: Fixed shape and volume
- **Liquid**: Fixed volume, variable shape
- **Gas**: Variable shape and volume
- **Plasma**: Ionized gas at high temperature

## Basic Biology Principles

### Cell Theory
1. All living things are made of cells
2. Cells are the basic unit of life
3. All cells come from pre-existing cells

### Classification of Life
- **Kingdom**: Broadest category
- **Phylum**: Major body plan differences
- **Class**: Similar characteristics
- **Order**: Similar families
- **Family**: Similar genera
- **Genus**: Similar species
- **Species**: Can interbreed

### Photosynthesis
- **Equation**: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
- Converts light energy to chemical energy
- Occurs in chloroplasts of plants

### Respiration
- **Equation**: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP
- Releases energy from glucose
- Occurs in mitochondria

## Important Scientific Units

### SI Base Units
- **Length**: Meter (m)
- **Mass**: Kilogram (kg)
- **Time**: Second (s)
- **Temperature**: Kelvin (K)
- **Electric Current**: Ampere (A)

### Common Derived Units
- **Force**: Newton (N)
- **Energy**: Joule (J)
- **Power**: Watt (W)
- **Pressure**: Pascal (Pa)

## Key Scientific Laws

1. **Law of Conservation of Mass**: Mass cannot be created or destroyed
2. **Law of Conservation of Energy**: Energy cannot be created or destroyed
3. **Mendel''s Laws**: Principles of inheritance
4. **Periodic Law**: Properties of elements are periodic functions of atomic number

Understanding these scientific principles provides a strong foundation for advanced study in physics, chemistry, and biology.',
        'text',
        1,
        true,
        35
      );

    -- Insert History lesson
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        history_lesson_id,
        history_course_id,
        'Ancient Indian Civilizations',
        '# Ancient Indian Civilizations

India''s rich history spans thousands of years, beginning with some of the world''s earliest civilizations. Let''s explore the foundations of Indian culture and society.

## Indus Valley Civilization (3300-1300 BCE)

### Key Features
- **Location**: Northwestern India and Pakistan
- **Major Cities**: Harappa, Mohenjo-daro, Dholavira, Kalibangan
- **Time Period**: Bronze Age civilization

### Characteristics
- **Urban Planning**: Well-planned cities with grid pattern
- **Drainage System**: Advanced sewerage and water management
- **Trade**: Extensive trade networks across Asia
- **Script**: Undeciphered Indus script
- **Religion**: Worship of Mother Goddess and Pashupati

### Decline
- Climate change and river course changes
- Possible Aryan invasions
- Internal conflicts and natural disasters

## Vedic Period (1500-500 BCE)

### Early Vedic Period (1500-1000 BCE)
- **Aryans**: Indo-European speaking people
- **Lifestyle**: Pastoral and semi-nomadic
- **Society**: Tribal organization
- **Religion**: Nature worship, fire sacrifices

### Later Vedic Period (1000-500 BCE)
- **Settlement**: Permanent agricultural settlements
- **Society**: Emergence of varna system
- **Political**: Rise of kingdoms (Mahajanapadas)
- **Literature**: Composition of Upanishads

## Vedic Literature

### Four Vedas
1. **Rigveda**: Oldest, collection of hymns
2. **Samaveda**: Musical chants
3. **Yajurveda**: Sacrificial formulas
4. **Atharveda**: Spells and charms

### Other Texts
- **Brahmanas**: Ritual texts
- **Aranyakas**: Forest texts
- **Upanishads**: Philosophical texts

## Mahajanapadas (6th Century BCE)

### Sixteen Great Kingdoms
- **Magadha**: Most powerful, modern Bihar
- **Kosala**: Modern Uttar Pradesh
- **Vatsa**: Around Allahabad
- **Avanti**: Modern Madhya Pradesh

### Political Systems
- **Monarchies**: Hereditary kings
- **Republics**: Elected assemblies (Ganas and Sanghas)

## Rise of New Religions

### Buddhism (6th Century BCE)
- **Founder**: Siddhartha Gautama (Buddha)
- **Four Noble Truths**: Suffering, cause, cessation, path
- **Eightfold Path**: Right understanding to right concentration
- **Key Concepts**: Karma, rebirth, nirvana

### Jainism (6th Century BCE)
- **Founder**: Vardhamana Mahavira (24th Tirthankara)
- **Core Principles**: Ahimsa (non-violence), truth, non-stealing
- **Three Jewels**: Right faith, right knowledge, right conduct

## Mauryan Empire (322-185 BCE)

### Chandragupta Maurya (322-298 BCE)
- Founded the empire with help of Chanakya
- Unified most of Indian subcontinent
- Capital at Pataliputra (modern Patna)

### Ashoka the Great (268-232 BCE)
- Greatest Mauryan ruler
- **Kalinga War**: Turning point, embraced Buddhism
- **Edicts**: Inscriptions promoting dharma
- **Administration**: Efficient bureaucracy

### Mauryan Administration
- **Central Government**: King, council of ministers
- **Provincial**: Governors for different regions
- **Local**: Village assemblies and officials
- **Military**: Large standing army

## Art and Architecture

### Mauryan Art
- **Pillars**: Ashoka pillars with animal capitals
- **Stupas**: Buddhist monuments (Sanchi Stupa)
- **Rock-cut**: Caves for monks (Barabar caves)

### Characteristics
- **Persian Influence**: In pillar design
- **Indigenous Elements**: Local artistic traditions
- **Religious Themes**: Buddhist and Jain motifs

## Economic Life

### Agriculture
- **Main Occupation**: Farming and cattle rearing
- **Crops**: Rice, wheat, barley, sugarcane
- **Tools**: Iron ploughs, sickles

### Trade and Commerce
- **Internal Trade**: Between regions
- **External Trade**: With Central Asia, Southeast Asia
- **Currency**: Punch-marked coins
- **Guilds**: Merchant and craft associations

## Social Structure

### Varna System
1. **Brahmanas**: Priests and teachers
2. **Kshatriyas**: Warriors and rulers
3. **Vaishyas**: Traders and farmers
4. **Shudras**: Service providers

### Family and Marriage
- **Patriarchal**: Male-dominated society
- **Joint Family**: Extended family system
- **Marriage**: Sacred institution, various types

## Legacy of Ancient India

### Contributions
- **Mathematics**: Decimal system, zero concept
- **Astronomy**: Calendar, planetary movements
- **Medicine**: Ayurveda, surgical techniques
- **Philosophy**: Diverse schools of thought
- **Literature**: Epics, poetry, drama

### Influence
- Spread of Indian culture to Southeast Asia
- Buddhist missions to various countries
- Trade connections across continents
- Foundation for later Indian empires

Understanding ancient Indian civilizations helps us appreciate the rich cultural heritage and foundational principles that continue to influence modern India.',
        'text',
        1,
        true,
        40
      );

    -- Insert Current Affairs lesson
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        current_affairs_lesson_id,
        current_affairs_course_id,
        'Indian Government and Constitution',
        '# Indian Government and Constitution

Understanding the structure and functioning of the Indian government is crucial for competitive exams. Let''s explore the constitutional framework and governance system.

## Indian Constitution

### Key Features
- **Adoption**: January 26, 1950 (Republic Day)
- **Drafting Committee**: Dr. B.R. Ambedkar (Chairman)
- **Length**: Longest written constitution in the world
- **Sources**: Government of India Act 1935, various world constitutions

### Fundamental Principles
- **Sovereignty**: Supreme power rests with the people
- **Democracy**: Government by the people
- **Republic**: Elected head of state
- **Secularism**: No state religion
- **Federalism**: Division of powers between center and states

## Structure of Government

### Executive Branch

#### President of India
- **Role**: Head of State, ceremonial head
- **Election**: Indirect election by Electoral College
- **Term**: 5 years, re-eligible
- **Powers**: Executive, legislative, judicial, emergency

#### Prime Minister
- **Role**: Head of Government, real executive power
- **Appointment**: Leader of majority party in Lok Sabha
- **Powers**: Policy making, cabinet leadership, parliamentary leadership

#### Council of Ministers
- **Cabinet Ministers**: Senior ministers, cabinet rank
- **Ministers of State**: Junior ministers
- **Deputy Ministers**: Assist ministers of state

### Legislative Branch

#### Parliament
- **Lok Sabha**: House of People (Lower House)
  - Members: 545 (543 elected + 2 nominated)
  - Term: 5 years
  - Presiding Officer: Speaker

- **Rajya Sabha**: Council of States (Upper House)
  - Members: 245 (233 elected + 12 nominated)
  - Term: 6 years (1/3 retire every 2 years)
  - Presiding Officer: Vice President

### Judicial Branch

#### Supreme Court
- **Chief Justice**: Head of judiciary
- **Judges**: Maximum 34 (including CJI)
- **Jurisdiction**: Original, appellate, advisory
- **Powers**: Judicial review, constitutional interpretation

#### High Courts
- **State Level**: One or more per state
- **Jurisdiction**: State matters, appeals from lower courts
- **Powers**: Writ jurisdiction, constitutional matters

#### Subordinate Courts
- **District Courts**: Civil and criminal matters
- **Magistrate Courts**: Minor offenses
- **Special Courts**: Specific subjects (family, consumer, etc.)

## Fundamental Rights (Part III)

### Six Categories
1. **Right to Equality** (Articles 14-18)
   - Equality before law
   - Prohibition of discrimination
   - Equality of opportunity

2. **Right to Freedom** (Articles 19-22)
   - Freedom of speech and expression
   - Freedom of assembly
   - Freedom of movement

3. **Right against Exploitation** (Articles 23-24)
   - Prohibition of trafficking
   - Prohibition of child labor

4. **Right to Freedom of Religion** (Articles 25-28)
   - Freedom of conscience
   - Freedom to practice religion

5. **Cultural and Educational Rights** (Articles 29-30)
   - Protection of minorities
   - Right to education

6. **Right to Constitutional Remedies** (Article 32)
   - Right to approach Supreme Court
   - Writs: Habeas Corpus, Mandamus, etc.

## Directive Principles of State Policy (Part IV)

### Categories
- **Socialistic**: Welfare state principles
- **Gandhian**: Village panchayats, prohibition
- **Liberal**: Uniform civil code, separation of powers

### Key Principles
- Right to work and education
- Public health and nutrition
- Protection of environment
- Promotion of international peace

## Fundamental Duties (Part IVA)

### Ten Duties (Originally)
1. Respect Constitution and national symbols
2. Cherish noble ideals of freedom struggle
3. Protect sovereignty and integrity
4. Defend country and render national service
5. Promote harmony and brotherhood
6. Preserve composite culture
7. Protect environment
8. Develop scientific temper
9. Safeguard public property
10. Strive for excellence

### Eleventh Duty (Added 2002)
- Provide opportunities for education (6-14 years)

## Federal Structure

### Union List (List I)
- **Subjects**: 100 subjects under central government
- **Examples**: Defense, foreign affairs, currency, railways

### State List (List II)
- **Subjects**: 61 subjects under state government
- **Examples**: Police, public health, agriculture, local government

### Concurrent List (List III)
- **Subjects**: 52 subjects under both center and states
- **Examples**: Education, forests, marriage, adoption

## Electoral System

### Election Commission
- **Composition**: Chief Election Commissioner + 2 Election Commissioners
- **Functions**: Conduct elections, voter registration, model code of conduct
- **Independence**: Constitutional body, secure tenure

### Types of Elections
- **Lok Sabha**: Direct election, first-past-the-post
- **Rajya Sabha**: Indirect election by state assemblies
- **State Assemblies**: Direct election
- **Local Bodies**: Panchayats and municipalities

## Important Constitutional Amendments

### Major Amendments
- **1st Amendment (1951)**: Land reforms, restrictions on fundamental rights
- **42nd Amendment (1976)**: "Mini Constitution", added duties and principles
- **44th Amendment (1978)**: Restored some provisions changed by 42nd
- **73rd Amendment (1992)**: Panchayati Raj institutions
- **74th Amendment (1992)**: Urban local bodies
- **101st Amendment (2016)**: Goods and Services Tax (GST)

## Current Government Structure

### Central Government
- **President**: Droupadi Murmu (15th President)
- **Prime Minister**: Narendra Modi (14th PM)
- **Political Party**: Bharatiya Janata Party (BJP)
- **Coalition**: National Democratic Alliance (NDA)

### Key Ministries
- **Home Affairs**: Internal security, police
- **Finance**: Economic policy, budget
- **External Affairs**: Foreign policy, diplomacy
- **Defence**: Armed forces, security

## Recent Developments

### Digital India
- **Objective**: Digital transformation of governance
- **Components**: Digital infrastructure, services, literacy
- **Initiatives**: Aadhaar, UPI, e-governance

### Good Governance
- **Principles**: Transparency, accountability, efficiency
- **Initiatives**: Right to Information, citizen services
- **Technology**: Online services, mobile apps

Understanding the Indian government structure and constitutional framework is essential for informed citizenship and success in competitive examinations.',
        'text',
        1,
        true,
        45
      );

    -- Insert Reasoning lesson
    INSERT INTO lessons (id, course_id, title, content, lesson_type, order_index, is_preview, estimated_duration) VALUES
      (
        reasoning_lesson_id,
        reasoning_course_id,
        'Logical Reasoning Fundamentals',
        '# Logical Reasoning Fundamentals

Logical reasoning is the ability to analyze information, identify patterns, and draw valid conclusions. It''s a crucial skill for competitive exams and everyday problem-solving.

## Types of Reasoning

### 1. Verbal Reasoning
Reasoning using words and language-based concepts.

#### Analogies
Finding relationships between word pairs.
- **Example**: Book : Author :: Painting : ?
- **Answer**: Artist (relationship: creator)

#### Classification
Identifying the odd one out or grouping similar items.
- **Example**: Rose, Jasmine, Lotus, Mango
- **Answer**: Mango (others are flowers)

#### Series Completion
Finding the next term in a sequence.
- **Example**: AB, DE, GH, ?
- **Answer**: JK (pattern: skip one letter)

### 2. Non-Verbal Reasoning
Reasoning using visual patterns and spatial relationships.

#### Pattern Recognition
Identifying visual patterns and sequences.
- Geometric shapes, rotations, reflections
- Size changes, color patterns
- Position changes

#### Spatial Reasoning
Understanding 3D relationships and transformations.
- Cube folding and unfolding
- Mirror images and rotations
- Hidden figures

### 3. Analytical Reasoning
Systematic analysis of complex information.

#### Syllogisms
Drawing conclusions from given premises.
- **Premise 1**: All birds can fly
- **Premise 2**: Sparrow is a bird
- **Conclusion**: Sparrow can fly

#### Logical Deduction
Using given facts to reach logical conclusions.
- If-then statements
- Cause and effect relationships
- Logical sequences

## Common Reasoning Topics

### Blood Relations
Understanding family relationships and connections.

#### Basic Relations
- **Parents**: Father, Mother
- **Children**: Son, Daughter
- **Siblings**: Brother, Sister
- **Grandparents**: Grandfather, Grandmother
- **Aunts/Uncles**: Father''s/Mother''s siblings

#### Solving Tips
1. Draw a family tree
2. Use symbols (M for male, F for female)
3. Mark relationships clearly
4. Work step by step

### Direction and Distance
Finding locations and calculating distances.

#### Directions
- **Cardinal**: North, South, East, West
- **Intermediate**: Northeast, Northwest, Southeast, Southwest

#### Problem-Solving Steps
1. Draw a rough diagram
2. Mark starting point
3. Follow the given directions
4. Calculate final position

### Coding and Decoding
Understanding patterns in coded information.

#### Letter Coding
- **Example**: If CAT = 24, what is DOG?
- **Solution**: A=1, B=2, C=3... so C+A+T = 3+1+20 = 24
- **Answer**: D+O+G = 4+15+7 = 26

#### Number Coding
- **Example**: If 123 means "good morning sir", what does "morning" mean?
- **Solution**: Identify common words and their codes

### Seating Arrangements
Organizing people or objects according to given conditions.

#### Types
- **Linear**: In a row (facing same/opposite directions)
- **Circular**: Around a table (facing center/outside)
- **Rectangular**: Around a rectangular table

#### Solving Strategy
1. Read all conditions carefully
2. Start with definite information
3. Use elimination method
4. Draw diagrams to visualize

### Data Sufficiency
Determining if given information is sufficient to answer a question.

#### Answer Choices
- **A**: Statement 1 alone is sufficient
- **B**: Statement 2 alone is sufficient
- **C**: Both statements together are sufficient
- **D**: Each statement alone is sufficient
- **E**: Both statements together are insufficient

## Problem-Solving Strategies

### 1. Understand the Question
- Read carefully and identify what''s being asked
- Note any special conditions or constraints
- Identify the type of reasoning required

### 2. Organize Information
- List given facts and conditions
- Draw diagrams when helpful
- Use tables or charts for complex data

### 3. Apply Logical Thinking
- Use elimination method
- Look for patterns and relationships
- Test your conclusions

### 4. Verify Your Answer
- Check if your answer satisfies all conditions
- Ensure logical consistency
- Review your reasoning process

## Practice Techniques

### Daily Practice
- Solve 10-15 reasoning questions daily
- Focus on different types of problems
- Time yourself to improve speed

### Pattern Recognition
- Look for patterns in everyday situations
- Practice with puzzles and brain teasers
- Develop visual-spatial skills

### Logical Analysis
- Question assumptions and conclusions
- Practice formal logic problems
- Develop critical thinking skills

## Common Mistakes to Avoid

### 1. Rushing Through Problems
- Take time to understand the question
- Don''t jump to conclusions
- Read all options carefully

### 2. Ignoring Conditions
- Note all given conditions
- Check if your answer violates any rule
- Consider all constraints

### 3. Poor Diagram Drawing
- Draw clear, accurate diagrams
- Use consistent symbols
- Label everything properly

### 4. Not Verifying Answers
- Always double-check your solution
- Ensure logical consistency
- Test with given conditions

## Advanced Reasoning Concepts

### Logical Operators
- **AND**: Both conditions must be true
- **OR**: At least one condition must be true
- **NOT**: Negation of the condition
- **IF-THEN**: Conditional statements

### Truth Tables
Understanding logical relationships through systematic analysis.

### Venn Diagrams
Visual representation of logical relationships between sets.

## Tips for Exam Success

### Time Management
- Allocate specific time for each question
- Skip difficult questions initially
- Return to skipped questions if time permits

### Accuracy vs Speed
- Focus on accuracy first
- Gradually increase speed with practice
- Don''t sacrifice accuracy for speed

### Stay Calm
- Don''t panic if a question seems difficult
- Use elimination method when unsure
- Trust your logical reasoning skills

Developing strong logical reasoning skills requires consistent practice and systematic approach. Focus on understanding concepts rather than memorizing solutions, and always verify your answers through logical analysis.',
        'text',
        1,
        true,
        35
      );

    -- Generate test IDs
    math_test_id := gen_random_uuid();
    science_test_id := gen_random_uuid();
    history_test_id := gen_random_uuid();
    current_affairs_test_id := gen_random_uuid();
    reasoning_test_id := gen_random_uuid();

    -- Insert tests for each course
    INSERT INTO tests (id, course_id, title, description, test_type, time_limit, total_questions, is_preview) VALUES
      (
        math_test_id,
        math_course_id,
        'Number Systems Quiz',
        'Test your understanding of different number systems and basic mathematical operations.',
        'lesson_quiz',
        15,
        5,
        true
      ),
      (
        science_test_id,
        science_course_id,
        'Scientific Method Assessment',
        'Evaluate your knowledge of scientific principles and methodology.',
        'topic_test',
        20,
        8,
        true
      ),
      (
        history_test_id,
        history_course_id,
        'Ancient India Knowledge Check',
        'Test your understanding of ancient Indian civilizations and their contributions.',
        'lesson_quiz',
        12,
        6,
        true
      ),
      (
        current_affairs_test_id,
        current_affairs_course_id,
        'Constitution and Government Quiz',
        'Assess your knowledge of Indian Constitution and government structure.',
        'mock_test',
        25,
        10,
        false
      ),
      (
        reasoning_test_id,
        reasoning_course_id,
        'Logical Reasoning Practice',
        'Practice various types of logical reasoning questions.',
        'practice',
        18,
        7,
        true
      );

    -- Insert sample questions for Mathematics test
    INSERT INTO questions (id, test_id, question_text, question_type, options, correct_answers, explanation, difficulty_level, tags, order_index) VALUES
      (
        gen_random_uuid(),
        math_test_id,
        'Which of the following is a rational number?',
        'mcq',
        '["√2", "π", "3/4", "√5"]',
        '["3/4"]',
        '3/4 is a rational number because it can be expressed as a fraction p/q where p and q are integers and q ≠ 0. The others (√2, π, √5) are irrational numbers.',
        1,
        ARRAY['rational numbers', 'number systems'],
        1
      ),
      (
        gen_random_uuid(),
        math_test_id,
        'What is the value of 2 + 3 × 4 - 1?',
        'mcq',
        '["13", "19", "20", "15"]',
        '["13"]',
        'Following BODMAS rule: 2 + 3 × 4 - 1 = 2 + 12 - 1 = 13. Multiplication is performed before addition and subtraction.',
        2,
        ARRAY['BODMAS', 'order of operations'],
        2
      );

    -- Insert sample questions for Science test
    INSERT INTO questions (id, test_id, question_text, question_type, options, correct_answers, explanation, difficulty_level, tags, order_index) VALUES
      (
        gen_random_uuid(),
        science_test_id,
        'What is the first step in the scientific method?',
        'mcq',
        '["Hypothesis", "Observation", "Experimentation", "Conclusion"]',
        '["Observation"]',
        'The scientific method begins with observation - carefully watching and recording natural phenomena to identify patterns or problems that need investigation.',
        1,
        ARRAY['scientific method', 'observation'],
        1
      ),
      (
        gen_random_uuid(),
        science_test_id,
        'Which law states that energy cannot be created or destroyed?',
        'mcq',
        '["Newton''s First Law", "Law of Conservation of Energy", "Law of Conservation of Mass", "Boyle''s Law"]',
        '["Law of Conservation of Energy"]',
        'The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed from one form to another.',
        2,
        ARRAY['energy', 'conservation laws'],
        2
      );

    -- Insert sample questions for History test
    INSERT INTO questions (id, test_id, question_text, question_type, options, correct_answers, explanation, difficulty_level, tags, order_index) VALUES
      (
        gen_random_uuid(),
        history_test_id,
        'Which was the largest city of the Indus Valley Civilization?',
        'mcq',
        '["Harappa", "Mohenjo-daro", "Dholavira", "Kalibangan"]',
        '["Mohenjo-daro"]',
        'Mohenjo-daro was the largest city of the Indus Valley Civilization, known for its advanced urban planning and drainage system.',
        2,
        ARRAY['Indus Valley', 'ancient cities'],
        1
      ),
      (
        gen_random_uuid(),
        history_test_id,
        'Who was the founder of the Mauryan Empire?',
        'mcq',
        '["Ashoka", "Chandragupta Maurya", "Bindusara", "Chanakya"]',
        '["Chandragupta Maurya"]',
        'Chandragupta Maurya founded the Mauryan Empire in 322 BCE with the help of his advisor Chanakya (Kautilya).',
        1,
        ARRAY['Mauryan Empire', 'Chandragupta'],
        2
      );

    -- Insert sample questions for Reasoning test
    INSERT INTO questions (id, test_id, question_text, question_type, options, correct_answers, explanation, difficulty_level, tags, order_index) VALUES
      (
        gen_random_uuid(),
        reasoning_test_id,
        'Find the next term in the series: 2, 6, 12, 20, ?',
        'mcq',
        '["28", "30", "32", "36"]',
        '["30"]',
        'The pattern is: 2×1=2, 2×3=6, 3×4=12, 4×5=20, so next is 5×6=30. Each term is the product of two consecutive numbers.',
        2,
        ARRAY['number series', 'patterns'],
        1
      ),
      (
        gen_random_uuid(),
        reasoning_test_id,
        'If A is the brother of B, and B is the sister of C, what is A to C?',
        'mcq',
        '["Brother", "Sister", "Cousin", "Cannot be determined"]',
        '["Brother"]',
        'Since A is the brother of B, A is male. Since B is the sister of C, and A is B''s brother, A is also C''s brother.',
        1,
        ARRAY['blood relations', 'family'],
        2
      );

    -- Insert notes for the new courses
    INSERT INTO notes (id, course_id, title, content, is_public, tags) VALUES
      (
        gen_random_uuid(),
        math_course_id,
        'Mathematics Formula Sheet',
        '# Essential Mathematics Formulas

## Arithmetic
- **Average**: (Sum of all values) ÷ (Number of values)
- **Percentage**: (Part/Whole) × 100
- **Profit/Loss**: (SP - CP)/CP × 100
- **Simple Interest**: (P × R × T)/100
- **Compound Interest**: P(1 + R/100)ⁿ - P

## Algebra
- **(a + b)²**: a² + 2ab + b²
- **(a - b)²**: a² - 2ab + b²
- **a² - b²**: (a + b)(a - b)
- **Quadratic Formula**: x = [-b ± √(b² - 4ac)]/2a

## Geometry
- **Area of Rectangle**: length × width
- **Area of Triangle**: ½ × base × height
- **Area of Circle**: πr²
- **Circumference**: 2πr
- **Pythagoras Theorem**: a² + b² = c²

## Statistics
- **Mean**: Sum/Count
- **Median**: Middle value when arranged in order
- **Mode**: Most frequently occurring value
- **Range**: Highest - Lowest value',
        true,
        ARRAY['mathematics', 'formulas', 'reference']
      ),
      (
        gen_random_uuid(),
        reasoning_course_id,
        'Reasoning Quick Tips',
        '# Reasoning Quick Reference

## Blood Relations
- **Father''s brother**: Uncle (Paternal)
- **Mother''s brother**: Uncle (Maternal)
- **Father''s sister**: Aunt (Paternal)
- **Mother''s sister**: Aunt (Maternal)
- **Son''s wife**: Daughter-in-law
- **Daughter''s husband**: Son-in-law

## Direction Tips
- **Clockwise**: N → E → S → W → N
- **Anti-clockwise**: N → W → S → E → N
- **Right turn**: 90° clockwise
- **Left turn**: 90° anti-clockwise
- **About turn**: 180° turn

## Coding Patterns
- **Letter to Number**: A=1, B=2, C=3...Z=26
- **Reverse Order**: A=26, B=25, C=24...Z=1
- **Position Value**: A=1, B=2 in alphabet
- **ASCII Values**: A=65, a=97

## Series Types
- **Arithmetic**: Common difference
- **Geometric**: Common ratio
- **Fibonacci**: Sum of previous two
- **Prime**: 2, 3, 5, 7, 11, 13...
- **Perfect Squares**: 1, 4, 9, 16, 25...',
        true,
        ARRAY['reasoning', 'tips', 'quick reference']
      );

END $$;