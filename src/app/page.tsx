import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { homes, users } from "@/db/schema"
import { eq, and, gte } from "drizzle-orm"
import { HomeCard } from "@/components/HomeCard"
import { SearchForm } from "@/components/SearchForm"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default async function HomePage() {
  const session = await auth()
  const db = getDb()

  const recentHomes = await db
    .select({
      home: homes,
      host: {
        name: users.name,
        image: users.image,
      },
    })
    .from(homes)
    .leftJoin(users, eq(homes.userId, users.id))
    .where(and(eq(homes.isActive, true)))
    .limit(8)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Creative Spaces for Artists
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Exchange homes with fellow artists worldwide. Find inspiring spaces that support your creative practice and cultural exploration.
            </p>
            {!session ? (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth/signin">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/homes">
                  <Button size="lg">Browse Homes</Button>
                </Link>
                <Link href="/homes/new">
                  <Button variant="outline" size="lg">List Your Home</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Find Your Next Creative Space</h2>
            <p className="mt-2 text-gray-600">Search available homes for your creative journey</p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Featured Homes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Creative Spaces</h2>
            <p className="mt-2 text-gray-600">Discover inspiring homes from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentHomes.map(({ home, host }) => (
              <HomeCard
                key={home.id}
                home={home}
                host={host}
              />
            ))}
          </div>
          {recentHomes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No homes available yet. Be the first to list yours!</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-2 text-gray-600">Simple steps to your next creative adventure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Share your artistic practice and what makes your space special</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse & Request</h3>
              <p className="text-gray-600">Find inspiring spaces and submit booking requests with your project details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect & Create</h3>
              <p className="text-gray-600">Get approved by hosts and start your creative journey</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}