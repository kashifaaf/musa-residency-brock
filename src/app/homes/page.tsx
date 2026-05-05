import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { homes, users } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { HomeCard } from "@/components/HomeCard"
import { SearchForm } from "@/components/SearchForm"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

interface SearchParams {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: string
}

export default async function HomesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()
  const db = getDb()

  let query = db
    .select({
      home: homes,
      host: {
        name: users.name,
        image: users.image,
      },
    })
    .from(homes)
    .leftJoin(users, eq(homes.userId, users.id))
    .where(eq(homes.isActive, true))
    .orderBy(desc(homes.createdAt))

  const allHomes = await query

  // Filter homes based on search parameters
  let filteredHomes = allHomes

  if (searchParams.location) {
    const location = searchParams.location.toLowerCase()
    filteredHomes = filteredHomes.filter(({ home }) =>
      home.location.toLowerCase().includes(location)
    )
  }

  if (searchParams.guests) {
    const guests = parseInt(searchParams.guests)
    if (!isNaN(guests)) {
      filteredHomes = filteredHomes.filter(({ home }) => home.maxGuests >= guests)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Homes</h1>
            <p className="text-gray-600 mt-2">
              {filteredHomes.length} creative spaces available
            </p>
          </div>
          {session && (
            <Link href="/homes/new">
              <Button>List Your Home</Button>
            </Link>
          )}
        </div>

        <div className="mb-8">
          <SearchForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomes.map(({ home, host }) => (
            <HomeCard
              key={home.id}
              home={home}
              host={host}
            />
          ))}
        </div>

        {filteredHomes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No homes found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or check back later for new listings.
            </p>
            {session && (
              <Link href="/homes/new">
                <Button>Be the first to list in this area</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}