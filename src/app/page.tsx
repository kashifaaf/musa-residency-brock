import Link from "next/link";
import { Search, Home, Users, ArrowRight } from "lucide-react";
import { SearchForm } from "@/components/home/SearchForm";
import { FeaturedHomes } from "@/components/home/FeaturedHomes";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl">
              Find Your Perfect Creative Exchange
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Connect with like-minded remote workers and exchange homes for authentic, 
              long-term stays. No phantom listings, no messaging hassles.
            </p>
          </div>

          {/* Search Form */}
          <div className="mt-10">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Search Available Homes</h3>
              <p className="text-gray-600">
                Browse real availability from verified hosts. No phantom listings or wasted time.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Home className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Request to Book</h3>
              <p className="text-gray-600">
                Send a booking request with your profile. Hosts respond within 24 hours or it auto-declines.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Enjoy Your Stay</h3>
              <p className="text-gray-600">
                Once approved, complete payment and enjoy authentic local experiences with your host's guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homes */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Homes</h2>
            <Link 
              href="/homes" 
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              View all homes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedHomes />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mb-8 text-xl text-gray-600">
            Join our community of remote workers exploring the world through home exchanges.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-primary-600 px-8 py-3 text-white hover:bg-primary-700"
            >
              Create Your Profile
            </Link>
            <Link
              href="/homes"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-gray-700 hover:bg-gray-50"
            >
              Browse Homes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}