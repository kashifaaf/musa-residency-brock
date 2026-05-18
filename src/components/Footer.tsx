import Link from "next/link"
import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">{APP_NAME}</h3>
            <p className="mt-2 text-sm text-secondary-foreground">
              A curated home exchange platform connecting culturally-minded remote workers with unique homes for long-term stays.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Platform</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/search" className="text-sm text-secondary-foreground hover:text-white transition-colors">Browse Homes</Link></li>
              <li><Link href="/listings/new" className="text-sm text-secondary-foreground hover:text-white transition-colors">List Your Home</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Support</h4>
            <ul className="mt-3 space-y-2">
              <li><span className="text-sm text-secondary-foreground">hello@musaresidency.com</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-secondary-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}