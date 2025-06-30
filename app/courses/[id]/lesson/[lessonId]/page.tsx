import { db } from '@/lib/supabase/database';
import React from 'react';

export default async function CourseLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const { lessonId } = await params;
  let lesson;
  try {
    lesson = await db.getLesson(lessonId);
  } catch (e) {
    lesson = null;
  }

  if (!lesson) {
    return <div className="max-w-2xl mx-auto p-4">Lesson not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
    </div>
  );
}