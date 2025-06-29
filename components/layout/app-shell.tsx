'use client';

import { ReactNode } from 'react';
import { TopBar } from './top-bar';
import { BottomNav } from './bottom-nav';
import { Home, BookOpen, FileText, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showTopBar?: boolean;
}

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  { icon: FileText, label: 'Tests', href: '/tests' },
  { icon: MessageCircle, label: 'Discuss', href: '/discussions' },
  { icon: User, label: 'Profile', href: '/profile' },
];

function SidebarNav() {
  // Use usePathname if you want active state
  // const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-56 md:shrink-0 h-full border-r bg-background/95">
      <nav className="flex flex-col gap-1 py-6 px-2">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <div className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium hover:bg-muted transition',
              // isActive ? 'text-primary bg-muted' : 'text-muted-foreground'
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function AppShell({ 
  children, 
  showBottomNav = true, 
  showTopBar = true 
}: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {showTopBar && <TopBar />}
      <div className="flex flex-1 min-h-0">
        <SidebarNav />
        <main className="flex-1 overflow-auto px-0 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4">
          {children}
        </main>
      </div>
      {/* Show BottomNav only on mobile */}
      {showBottomNav && <div className="md:hidden"><BottomNav /></div>}
    </div>
  );
}