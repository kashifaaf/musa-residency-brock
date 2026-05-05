import Link from "next/link"
import { getDb } from "@/lib/db"
import { homes, users } from "@/lib/db/schema"
import { eq, gte, lte, and, like } from "drizzle-orm"

interface SearchResultsProps {
  searchParams?: {
    location?: string
    checkin?: string
    checkout?: string
    guests?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    creativeSpace?: string
    amenities?: string
  }
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  try {
    const db = getDb()
    
    // Build where conditions
    const conditions = [eq(homes.isActive, true)]
    
    if (searchParams?.location) {
      conditions.push(like(homes.location, `%${searchParams.location}%`))
    }
    
    if (searchParams?.minPrice) {
      conditions.push(gte(homes.pricePerNight, parseInt(searchParams.minPrice)))
    }
    
    if (searchParams?.maxPrice) {
      conditions.push(lte(homes.pricePerNight, parseInt(searchParams.maxPrice)))
    }
    
    if (searchParams?.bedrooms) {
      conditions.push(gte(homes.bedrooms, parseInt(searchParams.bedrooms)))
    }
    
    if (searchParams?.bathrooms) {
      conditions.push(gte(homes.bathrooms, parseInt(searchParams.bathrooms)))
    }
    
    if (searchParams?.guests) {
      conditions.push(gte(homes.maxGuests, parseInt(searchParams.guests)))
    }
    
    if (searchParams?.creativeSpace === "true") {
      conditions.push(eq(homes.creativeSpace, true))
    }

    const searchResults = await db
      .select({
        id: homes.id,
        title: homes.title,
        description: homes.description,
        location: homes.location,
        pricePerNight: homes.pricePerNight,
        photos: homes.photos,
        bedrooms: homes.bedrooms,
        bathrooms: homes.bathrooms,
        maxGuests: homes.maxGuests,
        amenities: homes.amenities,
        creativeSpace: homes.creativeSpace,
        creativeAmenities: homes.creativeAmenities,
        hostName: users.name,
        hostImage: users.image,
        hostIsArtist: users.isArtist,
      })
      .from(homes)
      .innerJoin(users, eq(homes.userId, users.id))
      .where(and(...conditions))
      .orderBy(homes.createdAt)
      .limit(50)

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
          <p className="text-gray-600">Try adjusting your search filters or location.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {searchResults.length} space{searchResults.length > 1 ? 's' : ''} found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {searchResults.map((home) => (
            <Link
              key={home.id}
              href={`/homes/${home.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="lg:flex">
                <div className="lg:w-1/3">
                  {home.photos && home.photos.length > 0 ? (
                    <img
                      src={home.photos[0]}
                      alt={home.title}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 lg:h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="lg:w-2/3 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{home.title}</h3>
                      <p className="text-gray-600 mb-3">{home.location}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{home.bedrooms} bed{home.bedrooms > 1 ? 's' : ''}</span>
                        <span>{home.bathrooms} bath{home.bathrooms > 1 ? 's' : ''}</span>
                        <span>{home.maxGuests} guest{home.maxGuests > 1 ? 's' : ''}</span>
                      </div>

                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {home.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {home.creativeSpace && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Creative Space
                          </span>
                        )}
                        {home.hostIsArtist && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Artist Host
                          </span>
                        )}
                      </div>

                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          {home.hostImage ? (
                            <img
                              src={home.hostImage}
                              alt={home.hostName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {home.hostName?.charAt(0)?.toUpperCase() || "H"}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">Hosted by {home.hostName}</span>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${home.pricePerNight}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching search results:", error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Unable to load search results.</p>
        <p className="text-gray-500 mt-2">Please try again later.</p>
      </div>
    )
  }
}