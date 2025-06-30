"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

export default function LessonBottomBar({ prevLesson, nextLesson, courseId }: {
  prevLesson?: { id: string; title: string } | null;
  nextLesson?: { id: string; title: string } | null;
  courseId: string;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-center w-full max-w-2xl mx-auto gap-2 p-2 md:rounded-t-xl">
        <Button
          asChild
          variant="outline"
          className={`flex-1 min-w-0 flex items-center justify-center gap-2 ${!prevLesson ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!prevLesson}
        >
          {prevLesson ? (
            <Link href={`/courses/${courseId}/lesson/${prevLesson.id}`}><ArrowLeft className="h-5 w-5" />Previous</Link>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground"><ArrowLeft className="h-5 w-5" />Previous</span>
          )}
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 min-w-0 flex items-center justify-center gap-2"
        >
          <Link href={`/courses/${courseId}`}><Home className="h-5 w-5" />Course Home</Link>
        </Button>
        <Button
          asChild
          variant="default"
          className={`flex-1 min-w-0 flex items-center justify-center gap-2 ${!nextLesson ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!nextLesson}
        >
          {nextLesson ? (
            <Link href={`/courses/${courseId}/lesson/${nextLesson.id}`}>Next<ArrowRight className="h-5 w-5 ml-1" /></Link>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">Next<ArrowRight className="h-5 w-5 ml-1" /></span>
          )}
        </Button>
      </div>
    </nav>
  );
} 