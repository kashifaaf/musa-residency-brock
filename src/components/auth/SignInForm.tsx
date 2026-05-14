"use client";

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Button>
    </div>
  );
}