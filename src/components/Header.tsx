"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { ROUTES, APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Menu, X, Home, Search, Calendar, User, LogOut, Plus } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <Home className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold text-primary">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={ROUTES.search} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse Homes
          </Link>
          {session?.user && (
            <>
              <Link href={ROUTES.dashboard} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href={ROUTES.bookings} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Bookings
              </Link>
              <Link href={ROUTES.createListing} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors">
                <Plus className="h-4 w-4" />
                List Your Home
              </Link>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link href={ROUTES.profile} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="max-w-[120px] truncate">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        <button
          className="md:hidden rounded-md p-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            <Link href={ROUTES.search} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
              <Search className="h-4 w-4" /> Browse Homes
            </Link>
            {session?.user ? (
              <>
                <Link href={ROUTES.dashboard} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  <Home className="h-4 w-4" /> Dashboard
                </Link>
                <Link href={ROUTES.bookings} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  <Calendar className="h-4 w-4" /> Bookings
                </Link>
                <Link href={ROUTES.createListing} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  <Plus className="h-4 w-4" /> List Your Home
                </Link>
                <Link href={ROUTES.profile} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { signIn("google"); setMenuOpen(false) }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <User className="h-4 w-4" /> Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}