'use client';

import { ReactNode } from 'react';
import { TopBar } from './top-bar';
import { BottomNav } from './bottom-nav';

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showTopBar?: boolean;
}

export function AppShell({ 
  children, 
  showBottomNav = true, 
  showTopBar = true 
}: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {showTopBar && <TopBar />}
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}