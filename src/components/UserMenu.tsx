"use client"

import { useState } from "react"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { User, Menu, LogOut } from "lucide-react"
import Link from "next/link"

interface UserMenuProps {
  session: Session | null
}

export function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!session) {
    return (
      <Button onClick={() => signIn("google")}>
        Sign In
      </Button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full border border-gray-300 bg-white hover:shadow-md transition-shadow"
        aria-label="User menu"
      >
        <Menu size={16} />
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} />
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
            
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            
            <Link
              href="/host/homes"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              My Homes
            </Link>
            
            <Link
              href="/bookings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
            
            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}