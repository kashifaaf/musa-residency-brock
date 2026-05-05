'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        toast('Logged out successfully', 'success');
        router.push('/');
        router.refresh();
      } else {
        toast('Logout failed', 'error');
      }
    } catch (error) {
      toast('Something went wrong', 'error');
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          Musa Residency
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Browse Homes
          </Link>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}