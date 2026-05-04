"use client";

import { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

interface UserNavProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logout();
    if (result.success) {
      window.location.href = '/';
    }
    setIsLoggingOut(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block">{user.name || user.email}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/homes"
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              My Homes
            </Link>
            <Link
              href="/bookings"
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Bookings
            </Link>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
            >
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}