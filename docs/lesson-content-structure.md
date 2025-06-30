# Lesson Content Structure

This document outlines the JSON structure for lesson content stored in the database.

## Basic Structure

```json
{
  "version": "1.0",
  "createdAt": "2025-06-30T08:22:26+05:30",
  "updatedAt": "2025-06-30T08:22:26+05:30",
  "authorId": "user-123",
  "blocks": [
    // Array of content blocks
  ],
  "meta": {
    "duration": 15,
    "difficulty": "beginner",
    "tags": ["math", "basics"]
  }
}
```

## Block Types

### 1. Heading Block
```json
{
  "id": "1",
  "type": "heading",
  "data": {
    "text": "Welcome to EDUMYNT",
    "level": 1
  }
}
```

### 2. Text Block (Markdown)
```json
{
  "id": "2",
  "type": "text",
  "data": {
    "content": "This is a **markdown** text block.\n- Item 1\n- Item 2"
  }
}
```

### 3. Image Block
```json
{
  "id": "3",
  "type": "image",
  "data": {
    "url": "https://example.com/image.jpg",
    "alt": "Description of image",
    "caption": "Optional caption"
  }
}
```

### 4. Video Block
```json
{
  "id": "4",
  "type": "video",
  "data": {
    "url": "https://example.com/video.mp4",
    "title": "Optional video title",
    "poster": "https://example.com/thumbnail.jpg"
  }
}
```

### 5. HTML Block
```json
{
  "id": "5",
  "type": "html",
  "data": {
    "html": "<div>Custom HTML content</div>"
  }
}
```

### 6. Multiple Choice Question (MCQ)
```json
{
  "id": "6",
  "type": "mcq",
  "data": {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5"],
    "correct": 1,
    "explanation": "The correct answer is 4"
  }
}
```

## Future Implementation Notes

### Validation Rules
- All blocks must have a unique `id`
- `type` must be one of: `heading`, `text`, `image`, `video`, `html`, `mcq`
- Required fields must be present for each block type

### Database Considerations
- Store as JSONB in PostgreSQL for better querying
- Add GIN indexes for frequently queried fields
- Consider adding a version field for future migrations

### Frontend Implementation
- Use React components for each block type
- Implement proper error boundaries
- Add loading states for media content

### Security Considerations
- Sanitize HTML content
- Validate all URLs
- Implement rate limiting for API endpoints

## Example Complete Document

```json
{
  "version": "1.0",
  "createdAt": "2025-06-30T08:22:26+05:30",
  "updatedAt": "2025-06-30T09:00:00+05:30",
  "authorId": "user-123",
  "blocks": [
    {
      "id": "1",
      "type": "heading",
      "data": {
        "text": "Introduction to Math",
        "level": 1
      }
    },
    {
      "id": "2",
      "type": "text",
      "data": {
        "content": "Let's learn some basic math concepts."
      }
    },
    {
      "id": "3",
      "type": "mcq",
      "data": {
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5"],
        "correct": 1,
        "explanation": "The sum of 2 and 2 is 4"
      }
    }
  ],
  "meta": {
    "duration": 10,
    "difficulty": "beginner",
    "tags": ["math", "addition", "basics"]
  }
}
```

## Future Enhancements
1. Add support for quizzes with multiple questions
2. Implement progress tracking
3. Add support for interactive code blocks
4. Include accessibility features
5. Add support for embedded documents
6. Implement versioning for content updates
