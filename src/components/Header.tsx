import Link from "next/link"
import { auth } from "@/lib/auth"
import { UserMenu } from "./UserMenu"

export async function Header() {
  const session = await auth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              Musa Residency
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-gray-900">
              Search
            </Link>
            {session && (
              <Link href="/host" className="text-gray-700 hover:text-gray-900">
                Host
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}