'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Mail, ShoppingCart } from 'lucide-react';
import { resetPassword } from '@/lib/auth/auth-helpers';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
      toast.success('Password reset email sent!');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <Button 
            variant="ghost" 
            onClick={() => setSuccess(false)}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </Button>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Check your email
              </h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <Link href="/auth/login">
                <Button className="w-full h-11">
                  Back to Login
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setSuccess(false)}
                className="w-full h-11"
              >
                Try Different Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link href="/auth/login" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <div className="text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Reset your password
              </h1>
              <p className="text-muted-foreground">
                Enter your email to receive a reset link
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Send Reset Link Button */}
            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center pt-4">
              <Link href="/auth/login" className="text-primary hover:underline font-medium text-sm">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}