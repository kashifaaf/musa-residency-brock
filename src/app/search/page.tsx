import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { eq, and, ilike, gte, lte, or } from "drizzle-orm"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ListingCard } from "@/components/ListingCard"
import { SearchBar } from "@/components/SearchBar"
import { EmptyState } from "@/components/EmptyState"
import { Search } from "lucide-react"
import type { ListingWithHost } from "@/types"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const location = typeof params.location === "string" ? params.location : undefined
  const checkIn = typeof params.checkIn === "string" ? params.checkIn : undefined
  const checkOut = typeof params.checkOut === "string" ? params.checkOut : undefined
  const guests = typeof params.guests === "string" ? parseInt(params.guests) : undefined
  const country = typeof params.country === "string" ? params.country : undefined

  const conditions = [eq(listings.isPublished, true)]

  if (location) {
    conditions.push(
      or(
        ilike(listings.city, `%${location}%`),
        ilike(listings.country, `%${location}%`),
        ilike(listings.state, `%${location}%`)
      )!
    )
  }

  if (country) {
    conditions.push(ilike(listings.country, `%${country}%`))
  }

  if (guests) {
    conditions.push(gte(listings.maxGuests, guests))
  }

  let results: ListingWithHost[] = []
  try {
    results = (await db.query.listings.findMany({
      where: and(...conditions),
      with: {
        photos: {
          orderBy: (photos, { asc }) => [asc(photos.sortOrder)],
          limit: 1,
        },
        host: {
          columns: { id: true, name: true, image: true, bio: true, location: true },
        },
      },
      orderBy: (listings, { desc }) => [desc(listings.createdAt)],
      limit: 50,
    })) as ListingWithHost[]
  } catch (error) {
    console.error("Search error:", error)
  }

  const searchDescription = location
    ? `Showing results for "${location}"`
    : country
      ? `Showing results in ${country}`
      : "All available homes"

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="border-b border-gray-200 bg-white py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Browse Homes</h1>
                <p className="mt-1 text-sm text-gray-500">{searchDescription}</p>
              </div>
              <SearchBar compact />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No homes found"
              description="Try adjusting your search criteria or browse all available listings."
              actionLabel="Clear Search"
              actionHref="/search"
            />
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-500">
                {results.length} home{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}