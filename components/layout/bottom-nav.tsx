'use client';

import { Home, BookOpen, FileText, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  { icon: FileText, label: 'Tests', href: '/tests' },
  { icon: MessageCircle, label: 'Discuss', href: '/discussions' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href === '/dashboard' && pathname === '/');
          
          return (
            <Link key={item.label} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-col gap-1 h-12 px-2 text-xs font-medium",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}