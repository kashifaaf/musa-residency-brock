'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Musa Residency
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-gray-900">
              Search Homes
            </Link>
            {session && (
              <Link href="/host" className="text-gray-700 hover:text-gray-900">
                Host Your Home
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => signIn('google')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}