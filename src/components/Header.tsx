import Link from "next/link"
import { auth } from "@/lib/auth"
import { UserMenu } from "@/components/UserMenu"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Musa Residency
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Search Homes
            </Link>
            {session && (
              <>
                <Link href="/host/homes" className="text-gray-600 hover:text-gray-900">
                  My Homes
                </Link>
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                  My Bookings
                </Link>
              </>
            )}
          </nav>
          
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  )
}