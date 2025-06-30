"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function CollapsibleSidebar({ lessons, courseId, lessonId }: { lessons: any[]; courseId: string; lessonId: string }) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <aside className={`hidden md:flex flex-col h-full border-r bg-background/95 transition-all duration-200 ${collapsed ? 'w-14' : 'w-80'}`}>
      <div className="flex items-center justify-between p-2 border-b">
        {!collapsed && <h2 className="text-lg font-semibold ml-2">Lessons</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <span className="text-xl">›</span>
          ) : (
            <span className="text-xl">‹</span>
          )}
        </Button>
      </div>
      {!collapsed && (
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            {lessons.map((l: any, idx: number) => (
              <Link key={l.id} href={`/courses/${courseId}/lesson/${l.id}`}>
                <Button
                  variant={l.id === lessonId ? 'default' : 'ghost'}
                  className="w-full justify-start mb-1 text-left"
                >
                  <span className="font-medium">{idx + 1}. {l.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
} 