"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function MobileLessonSheet({ lessons, courseId, lessonId, open, setOpen }: {
  lessons: any[];
  courseId: string;
  lessonId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 max-w-full p-0">
          <SheetHeader>
            <SheetTitle className="p-4">Lessons</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <div className="space-y-2">
              {lessons.map((l: any, idx: number) => (
                <Link key={l.id} href={`/courses/${courseId}/lesson/${l.id}`}>
                  <Button
                    variant={l.id === lessonId ? 'default' : 'ghost'}
                    className="w-full justify-start mb-1 text-left"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">{idx + 1}. {l.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 