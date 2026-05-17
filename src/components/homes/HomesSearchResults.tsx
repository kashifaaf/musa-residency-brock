import { getDb } from '@/lib/db'
import { homes, users, availability } from '@/lib/db/schema'
import { and, eq, or, ilike, gte, lte, sql } from 'drizzle-orm'
import { HomeCard } from '@/components/homes/HomeCard'
import { SearchForm } from '@/components/search/SearchForm'
import { Pagination } from '@/components/ui/Pagination'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

interface HomesSearchResultsProps {
  searchParams: {
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    page?: string
  }
}

export async function HomesSearchResults({ searchParams }: HomesSearchResultsProps) {
  const db = getDb()
  const page = parseInt(searchParams.page || '1')
  const limit = DEFAULT_PAGE_SIZE
  const offset = (page - 1) * limit

  // Build search conditions
  const conditions = [eq(homes.isActive, true)]

  if (searchParams.location) {
    conditions.push(
      or(
        ilike(homes.city, `%${searchParams.location}%`),
        ilike(homes.country, `%${searchParams.location}%`)
      )!
    )
  }

  if (searchParams.guests) {
    conditions.push(gte(homes.maxGuests, parseInt(searchParams.guests)))
  }

  // Convert searchParams for SearchForm
  const searchFormInitialValues = {
    location: searchParams.location,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests ? parseInt(searchParams.guests) : undefined,
  }

  // Get homes with availability check
  const query = db
    .select({
      home: homes,
      host: users,
    })
    .from(homes)
    .leftJoin(users, eq(homes.hostId, users.id))
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)

  // If dates are provided, join with availability
  if (searchParams.checkIn && searchParams.checkOut) {
    const checkIn = new Date(searchParams.checkIn)
    const checkOut = new Date(searchParams.checkOut)

    // This is a simplified availability check
    // In production, you'd want more sophisticated availability logic
    const results = await query
    const availableHomeIds = await db
      .select({ homeId: availability.homeId })
      .from(availability)
      .where(
        and(
          lte(availability.startDate, checkIn),
          gte(availability.endDate, checkOut),
          eq(availability.isAvailable, true)
        )
      )

    const availableIds = new Set(availableHomeIds.map(a => a.homeId))
    const filteredResults = results.filter(r => availableIds.has(r.home.id))

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchForm
            initialValues={searchFormInitialValues}
            onSearch={() => {}}
            isLoading={false}
          />
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            {filteredResults.length} homes available
          </h1>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No homes found for your search criteria.</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or search in a different location.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredResults.map(({ home, host }) => (
                <HomeCard key={home.id} home={home} host={host!} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredResults.length / limit)}
              baseUrl="/homes"
              searchParams={searchParams}
            />
          </>
        )}
      </div>
    )
  }

  // No date filtering
  const results = await query
  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(homes)
    .where(and(...conditions))
    .then(res => res[0]?.count || 0)

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchForm
          initialValues={searchFormInitialValues}
          onSearch={() => {}}
          isLoading={false}
        />
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          {totalCount} homes available
        </h1>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No homes found for your search criteria.</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or search in a different location.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.map(({ home, host }) => (
              <HomeCard key={home.id} home={home} host={host!} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/homes"
            searchParams={searchParams}
          />
        </>
      )}
    </div>
  )
}