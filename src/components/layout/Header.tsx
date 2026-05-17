import Link from 'next/link'
import { auth } from '@/lib/auth'
import { UserMenu } from '@/components/layout/UserMenu'
import { Button } from '@/components/ui/Button'

export async function Header() {
  const session = await auth()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            Musa Residency
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/homes" className="text-gray-700 hover:text-gray-900">
              Browse Homes
            </Link>
            {session?.user?.isHost && (
              <Link href="/host/dashboard" className="text-gray-700 hover:text-gray-900">
                Host Dashboard
              </Link>
            )}
            <Link href="/how-it-works" className="text-gray-700 hover:text-gray-900">
              How It Works
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {!session.user?.isHost && (
                  <Link href="/host">
                    <Button variant="outline">Become a Host</Button>
                  </Link>
                )}
                <UserMenu user={session.user as any} />
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signin">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}