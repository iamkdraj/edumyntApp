"use client";
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function LessonTopBar({ onMenuClick, courseId }: { onMenuClick?: () => void; courseId: string }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Menu button (mobile only) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open lessons menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-lg hidden md:inline">EDUMYNT</span>
        </div>
        {/* Center logo/app name (mobile) */}
        <span className="font-semibold text-lg md:hidden">EDUMYNT</span>
        {/* Right side: dark mode toggle and back button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to course"
            onClick={() => router.push(`/courses/${courseId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
} 