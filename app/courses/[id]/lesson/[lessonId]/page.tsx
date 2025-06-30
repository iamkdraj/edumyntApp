"use client";
import { useState } from 'react';
import { db } from '@/lib/supabase/database';
import Link from 'next/link';
import CollapsibleSidebar from '@/components/layout/collapsible-sidebar';
import MobileLessonSheet from '@/components/layout/mobile-lesson-sheet';
import LessonTopBar from '@/components/layout/lesson-top-bar';
import LessonBottomBar from '@/components/layout/lesson-bottom-bar';
import React, { useEffect } from 'react';

export default function CourseLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const { id: courseId, lessonId } = params;
  const [lesson, setLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const lessonData = await db.getLesson(lessonId);
        const lessonsData = await db.getLessons(courseId);
        setLesson(lessonData);
        setLessons(lessonsData);
      } catch (e) {
        setLesson(null);
        setLessons([]);
      }
    }
    fetchData();
  }, [courseId, lessonId]);

  const currentIndex = lessons.findIndex((l: any) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile menu button and sidebar for lessons */}
      <MobileLessonSheet
        lessons={lessons}
        courseId={courseId}
        lessonId={lessonId}
        open={menuOpen}
        setOpen={setMenuOpen}
      />
      {/* Only show the lesson top bar, not the main top bar */}
      <LessonTopBar courseId={courseId} onMenuClick={() => setMenuOpen(true)} />
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
      <LessonBottomBar prevLesson={prevLesson} nextLesson={nextLesson} courseId={courseId} />
    </div>
  );
}