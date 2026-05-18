import Link from "next/link"
import { db } from "@/lib/db"
import { listings, listingPhotos } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SearchBar } from "@/components/SearchBar"
import { ListingCard } from "@/components/ListingCard"
import { Home, Shield, Clock, Globe } from "lucide-react"
import type { ListingWithHost } from "@/types"

async function getFeaturedListings(): Promise<ListingWithHost[]> {
  try {
    const results = await db.query.listings.findMany({
      where: eq(listings.isPublished, true),
      with: {
        photos: {
          orderBy: (photos, { asc }) => [asc(photos.sortOrder)],
          limit: 1,
        },
        host: {
          columns: { id: true, name: true, image: true, bio: true, location: true },
        },
      },
      orderBy: desc(listings.createdAt),
      limit: 6,
    })
    return results as ListingWithHost[]
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredListings = await getFeaturedListings()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Stay in homes that{" "}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  inspire
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
                A curated home exchange platform for culturally-minded remote workers. 
                Real availability, fast responses, and homes you&apos;ll actually want to stay in.
              </p>
              <div className="mt-10 flex justify-center">
                <SearchBar />
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-100/30 blur-3xl" />
        </section>

        {/* How It Works */}
        <section className="border-t border-gray-100 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
              <p className="mt-3 text-gray-500">Simple, fast, and reliable bookings</p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Globe,
                  title: "Browse Real Homes",
                  description:
                    "Every listing has verified availability. No phantom listings, no wasted time.",
                },
                {
                  icon: Clock,
                  title: "Quick Responses",
                  description:
                    "Hosts respond within 24 hours or the request auto-declines. No more waiting.",
                },
                {
                  icon: Shield,
                  title: "Secure Payments",
                  description:
                    "Payment is only processed after the host approves. Protected by Stripe.",
                },
                {
                  icon: Home,
                  title: "Move In",
                  description:
                    "Enjoy curated homes with creative amenities perfect for remote work and living.",
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Featured homes</h2>
                  <p className="mt-2 text-gray-500">Curated spaces for creative living</p>
                </div>
                <Link
                  href="/search"
                  className="hidden sm:inline-flex rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/search"
                  className="inline-flex rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700"
                >
                  View all homes
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-primary-700 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white">Have a home to share?</h2>
            <p className="mt-4 text-lg text-primary-100">
              List your space and earn while you travel. Our platform makes hosting simple with 
              verified guests and quick booking management.
            </p>
            <Link
              href="/listings/new"
              className="mt-8 inline-flex rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
            >
              List Your Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}