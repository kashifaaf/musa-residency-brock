import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { eq, and, ilike, or, desc } from "drizzle-orm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { SearchForm } from "@/components/SearchForm"
import { ListingCard } from "@/components/ListingCard"
import { LISTINGS_PER_PAGE } from "@/lib/constants"
import type { ListingWithHost, SearchParams } from "@/types"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { city, country, checkIn, checkOut, guests, minPrice, maxPrice } = params

  let results: ListingWithHost[] = []
  try {
    const conditions = [eq(listings.isPublished, true)]

    if (city) {
      conditions.push(
        or(
          ilike(listings.city, `%${city}%`),
          ilike(listings.country, `%${city}%`),
          ilike(listings.location, `%${city}%`)
        )!
      )
    }

    results = (await db.query.listings.findMany({
      where: and(...conditions),
      with: {
        photos: true,
        host: {
          columns: { id: true, name: true, image: true, location: true, bio: true },
        },
      },
      orderBy: [desc(listings.createdAt)],
      limit: LISTINGS_PER_PAGE,
    })) as ListingWithHost[]

    if (guests) {
      const guestCount = parseInt(guests, 10)
      if (!isNaN(guestCount)) {
        results = results.filter((l) => l.maxGuests >= guestCount)
      }
    }
  } catch (e) {
    console.error("Search error:", e)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Find Your Next Home</h1>
          <div className="mt-6">
            <SearchForm
              defaultValues={{ city: city || "", checkIn: checkIn || "", checkOut: checkOut || "", guests: guests || "" }}
              variant="inline"
            />
          </div>
          <div className="mt-8">
            {results.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-foreground">No homes found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search criteria or browse all available homes.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {results.length} home{results.length !== 1 ? "s" : ""} found
                  {city ? ` for "${city}"` : ""}
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}