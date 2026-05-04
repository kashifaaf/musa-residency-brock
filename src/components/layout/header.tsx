import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { UserNav } from './user-nav';

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Musa Residency
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-foreground hover:text-primary">
              Search Homes
            </Link>
            {session?.user && (
              <>
                <Link href="/homes/create" className="text-foreground hover:text-primary">
                  List Your Home
                </Link>
                <Link href="/bookings" className="text-foreground hover:text-primary">
                  Bookings
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <UserNav user={session.user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="text-foreground hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}