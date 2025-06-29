'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Root page: Checking authentication...');
        const user = await getCurrentUser();
        
        if (user) {
          console.log('Root page: User found, redirecting to dashboard');
          window.location.replace('/dashboard');
        } else {
          console.log('Root page: No user found, redirecting to login');
          window.location.replace('/auth/login');
        }
      } catch (error) {
        console.error('Root page: Error checking auth:', error);
        window.location.replace('/auth/login');
      } finally {
        setIsChecking(false);
      }
    };

    // Small delay to ensure proper initialization
    const timer = setTimeout(checkAuth, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isChecking) {
    return null; // Don't show loading if we're done checking
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading EDUMYNT...</p>
      </div>
    </div>
  );
}