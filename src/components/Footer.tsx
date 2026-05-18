import Link from "next/link"
import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
                M
              </div>
              <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              A curated home exchange platform for culturally-minded remote workers and creative professionals.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-sm text-gray-600 hover:text-primary-700">
                  Browse Homes
                </Link>
              </li>
              <li>
                <Link href="/search?country=Portugal" className="text-sm text-gray-600 hover:text-primary-700">
                  Portugal
                </Link>
              </li>
              <li>
                <Link href="/search?country=Mexico" className="text-sm text-gray-600 hover:text-primary-700">
                  Mexico
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Host</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/listings/new" className="text-sm text-gray-600 hover:text-primary-700">
                  List Your Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-700">
                  Host Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-primary-700">
                  Your Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}