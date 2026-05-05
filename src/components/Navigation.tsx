"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button"

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Musa Residency
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/search" className="text-gray-700 hover:text-gray-900">
              Search
            </Link>
            
            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : session ? (
              <>
                <Link href="/host" className="text-gray-700 hover:text-gray-900">
                  Host
                </Link>
                <Link href="/bookings" className="text-gray-700 hover:text-gray-900">
                  Bookings
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <Button onClick={() => signOut()} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn("google")} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}