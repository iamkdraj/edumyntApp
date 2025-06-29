'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const user = await getCurrentUser();
        
        if (user) {
          console.log('User found, redirecting to dashboard');
          // User is logged in, redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          console.log('No user found, redirecting to login');
          // User is not logged in, redirect to login
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Error checking auth, redirect to login
        window.location.href = '/auth/login';
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (!isChecking) {
    return null; // Don't render anything if we're not checking anymore
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