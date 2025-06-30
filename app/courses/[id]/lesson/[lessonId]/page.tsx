import { db } from '@/lib/supabase/database';
import { TopBar } from '@/components/layout/top-bar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import CollapsibleSidebar from '@/components/layout/collapsible-sidebar';

export default async function CourseLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const { id: courseId, lessonId } = params;

  // Fetch lesson and all lessons in course
  let lesson = null;
  let lessons = [];
  try {
    lesson = await db.getLesson(lessonId);
    lessons = await db.getLessons(courseId);
  } catch (e) {
    // fallback: show not found
  }

  // Find current lesson index for prev/next
  const currentIndex = lessons.findIndex((l: any) => l.id === lessonId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Collapsible Sidebar: All Lessons */}
        <CollapsibleSidebar lessons={lessons} courseId={courseId} lessonId={lessonId} />
        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          {lesson ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
            </>
          ) : (
            <div className="text-center text-muted-foreground py-20">Lesson not found.</div>
          )}
        </main>
      </div>
    </div>
  );
}