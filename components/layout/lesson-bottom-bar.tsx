"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function LessonBottomBar({ prevLesson, nextLesson, courseId }: {
  prevLesson?: { id: string; title: string } | null;
  nextLesson?: { id: string; title: string } | null;
  courseId: string;
}) {
  return (
    <nav className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between max-w-2xl mx-auto gap-2 p-2">
        <Button asChild variant="outline" className="flex-1" disabled={!prevLesson}>
          {prevLesson ? (
            <Link href={`/courses/${courseId}/lesson/${prevLesson.id}`}>Previous</Link>
          ) : (
            <span>Previous</span>
          )}
        </Button>
        <Button asChild variant="ghost" className="flex-1">
          <Link href="/dashboard">Home</Link>
        </Button>
        <Button asChild variant="ghost" className="flex-1">
          <Link href={`/courses/${courseId}`}>Course Home</Link>
        </Button>
        <Button asChild variant="default" className="flex-1" disabled={!nextLesson}>
          {nextLesson ? (
            <Link href={`/courses/${courseId}/lesson/${nextLesson.id}`}>Next</Link>
          ) : (
            <span>Next</span>
          )}
        </Button>
      </div>
    </nav>
  );
} 