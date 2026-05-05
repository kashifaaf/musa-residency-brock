'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toaster';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      bio: formData.get('bio') as string,
      location: formData.get('location') as string,
      workInfo: formData.get('workInfo') as string,
      socialMedia: formData.get('socialMedia') as string,
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast('Account created successfully! Welcome to Musa Residency.', 'success');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast(result.error, 'error');
      }
    } catch (error) {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., New York, NY"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="workInfo">Work Information</Label>
        <Input
          id="workInfo"
          name="workInfo"
          type="text"
          placeholder="e.g., Freelance Designer, Remote Developer"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell us about yourself and what you're looking for..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="socialMedia">Social Media (optional)</Label>
        <Input
          id="socialMedia"
          name="socialMedia"
          type="text"
          placeholder="Instagram, LinkedIn, or personal website"
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}