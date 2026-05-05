import { getDb } from "@/lib/db"
import { homes, users } from "@/lib/db/schema"
import { eq, ilike, and, gte, lte } from "drizzle-orm"
import { HomeCard } from "@/components/HomeCard"
import type { SearchFilters, HomeWithHost } from "@/lib/types"

interface SearchResultsProps {
  filters: SearchFilters
}

export async function SearchResults({ filters }: SearchResultsProps) {
  const db = getDb()
  
  try {
    const conditions = [eq(homes.isActive, true)]
    
    if (filters.location) {
      conditions.push(
        ilike(homes.city, `%${filters.location}%`)
      )
    }
    
    if (filters.guests) {
      conditions.push(gte(homes.maxGuests, filters.guests))
    }
    
    if (filters.minPrice) {
      conditions.push(gte(homes.pricePerNight, filters.minPrice * 100))
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(homes.pricePerNight, filters.maxPrice * 100))
    }

    const results = await db
      .select({
        id: homes.id,
        title: homes.title,
        description: homes.description,
        address: homes.address,
        city: homes.city,
        country: homes.country,
        pricePerNight: homes.pricePerNight,
        bedrooms: homes.bedrooms,
        bathrooms: homes.bathrooms,
        maxGuests: homes.maxGuests,
        amenities: homes.amenities,
        photos: homes.photos,
        isActive: homes.isActive,
        createdAt: homes.createdAt,
        updatedAt: homes.updatedAt,
        hostId: users.id,
        hostName: users.name,
        hostImage: users.image,
        hostLocation: users.location,
      })
      .from(homes)
      .innerJoin(users, eq(homes.hostId, users.id))
      .where(and(...conditions))
      .limit(20)

    if (results.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No homes found</h2>
          <p className="text-gray-600">
            Try adjusting your search criteria or explore different locations.
          </p>
        </div>
      )
    }

    const homesWithHost = results.map(home => ({
      id: home.id,
      title: home.title,
      description: home.description,
      address: home.address,
      city: home.city,
      country: home.country,
      pricePerNight: home.pricePerNight,
      bedrooms: home.bedrooms,
      bathrooms: home.bathrooms,
      maxGuests: home.maxGuests,
      amenities: home.amenities,
      photos: home.photos,
      isActive: home.isActive,
      createdAt: home.createdAt,
      updatedAt: home.updatedAt,
      host: {
        id: home.hostId,
        name: home.hostName,
        image: home.hostImage,
        location: home.hostLocation,
      }
    }))

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {results.length} homes found
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {homesWithHost.map((home) => (
            <HomeCard key={home.id} home={home as HomeWithHost} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error searching homes:", error)
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Search Error</h2>
        <p className="text-gray-600">
          Something went wrong while searching. Please try again later.
        </p>
      </div>
    )
  }
}