'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/Button';

export function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Musa Residency
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-gray-900"
            >
              Browse Homes
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/host/homes" 
                  className="text-gray-700 hover:text-gray-900"
                >
                  My Homes
                </Link>
                <Link 
                  href="/bookings" 
                  className="text-gray-700 hover:text-gray-900"
                >
                  My Bookings
                </Link>
                <Link 
                  href="/profile" 
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}