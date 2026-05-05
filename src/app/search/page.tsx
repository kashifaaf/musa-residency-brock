import { Suspense } from "react"
import { SearchForm } from "@/components/SearchForm"
import { HomeCard } from "@/components/HomeCard"
import { db } from "@/lib/db"
import { homes, availability } from "@/lib/db/schema"
import { eq, and, gte, lte, like } from "drizzle-orm"
import type { SearchParams } from "@/types"

interface SearchPageProps {
  searchParams: Promise<SearchParams>
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  let whereConditions = [eq(homes.isActive, true)]
  
  // Filter by location if provided
  if (searchParams.location) {
    whereConditions.push(like(homes.location, `%${searchParams.location}%`))
  }
  
  let availableHomes = await db
    .select()
    .from(homes)
    .where(and(...whereConditions))
    .limit(20)
  
  // Filter by date availability if dates are provided
  if (searchParams.startDate && searchParams.endDate) {
    const startDate = new Date(searchParams.startDate)
    const endDate = new Date(searchParams.endDate)
    
    const availableHomeIds = await db
      .select({ homeId: availability.homeId })
      .from(availability)
      .where(
        and(
          eq(availability.isAvailable, true),
          lte(availability.startDate, startDate),
          gte(availability.endDate, endDate)
        )
      )
    
    const availableIds = availableHomeIds.map(a => a.homeId)
    availableHomes = availableHomes.filter(home => availableIds.includes(home.id))
  }
  
  // Filter by guest count if provided
  if (searchParams.guests) {
    const guestCount = parseInt(searchParams.guests)
    availableHomes = availableHomes.filter(home => home.maxGuests >= guestCount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {availableHomes.length} home{availableHomes.length !== 1 ? "s" : ""} found
        </h2>
        
        {(searchParams.location || searchParams.startDate || searchParams.endDate) && (
          <div className="text-sm text-gray-600">
            {searchParams.location && `in ${searchParams.location}`}
            {searchParams.startDate && searchParams.endDate && 
              ` for ${new Date(searchParams.startDate).toLocaleDateString()} - ${new Date(searchParams.endDate).toLocaleDateString()}`
            }
          </div>
        )}
      </div>
      
      {availableHomes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableHomes.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No homes found matching your criteria.</p>
          <p className="text-gray-400">Try adjusting your search filters or dates.</p>
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Creative Space</h1>
        <SearchForm />
      </div>
      
      <Suspense fallback={<div>Loading homes...</div>}>
        <SearchResults searchParams={params} />
      </Suspense>
    </div>
  )
}