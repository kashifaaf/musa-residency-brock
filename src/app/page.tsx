import Link from "next/link"
import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { SearchForm } from "@/components/SearchForm"
import { ListingCard } from "@/components/ListingCard"
import { ROUTES, APP_NAME } from "@/lib/constants"
import { Home, Shield, Clock, Globe } from "lucide-react"
import type { ListingWithHost } from "@/types"

export default async function HomePage() {
  let featuredListings: ListingWithHost[] = []
  try {
    featuredListings = (await db.query.listings.findMany({
      where: eq(listings.isPublished, true),
      with: {
        photos: true,
        host: {
          columns: { id: true, name: true, image: true, location: true, bio: true },
        },
      },
      orderBy: [desc(listings.createdAt)],
      limit: 6,
    })) as ListingWithHost[]
  } catch (e) {
    console.error("Failed to fetch featured listings:", e)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-primary px-4 py-20 text-primary-foreground sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Live somewhere inspiring.
              </h1>
              <p className="mt-4 text-lg text-secondary-foreground sm:text-xl">
                {APP_NAME} connects culturally-minded remote workers with unique homes for long-term stays. No phantom listings. Real availability. Quick responses.
              </p>
            </div>
            <div className="mt-10 max-w-4xl">
              <SearchForm variant="hero" />
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="border-b border-border px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
              A better way to stay
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Home, title: "Real Homes", desc: "Curated spaces from real people. No corporate listings." },
                { icon: Clock, title: "Quick Responses", desc: "Hosts respond within 24 hours or bookings auto-decline." },
                { icon: Shield, title: "Trusted Community", desc: "Verified profiles and secure Stripe payments." },
                { icon: Globe, title: "Long-Term Stays", desc: "Designed for 30+ day stays. Live like a local." },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Featured Homes</h2>
                <Link href={ROUTES.search} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-secondary px-4 py-16 text-secondary-foreground">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Have a space to share?
            </h2>
            <p className="mt-4 text-secondary-foreground">
              List your home on {APP_NAME} and connect with culturally-minded travelers looking for authentic, long-term stays.
            </p>
            <Link
              href={ROUTES.createListing}
              className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              List Your Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}