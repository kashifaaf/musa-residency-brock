"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/Button"
import { useState } from "react"

export function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Musa Residency</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/homes" className="text-gray-700 hover:text-primary-600">
              Browse Homes
            </Link>
            {session && (
              <>
                <Link href="/bookings" className="text-gray-700 hover:text-primary-600">
                  My Bookings
                </Link>
                <Link href="/homes/new" className="text-gray-700 hover:text-primary-600">
                  List Your Home
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/homes" className="text-gray-700 hover:text-primary-600">
                Browse Homes
              </Link>
              {session && (
                <>
                  <Link href="/bookings" className="text-gray-700 hover:text-primary-600">
                    My Bookings
                  </Link>
                  <Link href="/homes/new" className="text-gray-700 hover:text-primary-600">
                    List Your Home
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-gray-700 hover:text-primary-600"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!session && (
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}