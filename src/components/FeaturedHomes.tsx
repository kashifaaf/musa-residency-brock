import Link from "next/link"
import { getDb } from "@/lib/db"
import { homes, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function FeaturedHomes() {
  try {
    const db = getDb()
    const featuredHomes = await db
      .select({
        id: homes.id,
        title: homes.title,
        location: homes.location,
        pricePerNight: homes.pricePerNight,
        photos: homes.photos,
        bedrooms: homes.bedrooms,
        bathrooms: homes.bathrooms,
        maxGuests: homes.maxGuests,
        creativeSpace: homes.creativeSpace,
        hostName: users.name,
      })
      .from(homes)
      .innerJoin(users, eq(homes.userId, users.id))
      .where(eq(homes.isActive, true))
      .limit(6)

    if (featuredHomes.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No featured homes available at the moment.</p>
          <p className="text-gray-500 mt-2">Check back soon for amazing creative spaces!</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredHomes.map((home) => (
          <Link
            key={home.id}
            href={`/homes/${home.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {home.photos && home.photos.length > 0 ? (
                <img
                  src={home.photos[0]}
                  alt={home.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{home.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{home.location}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>{home.bedrooms} bed{home.bedrooms > 1 ? 's' : ''}</span>
                    <span>{home.bathrooms} bath{home.bathrooms > 1 ? 's' : ''}</span>
                    <span>{home.maxGuests} guest{home.maxGuests > 1 ? 's' : ''}</span>
                  </div>

                  {home.creativeSpace && (
                    <div className="flex items-center space-x-1 mb-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-sm text-orange-600 font-medium">Creative Space</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">Hosted by {home.hostName}</p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${home.pricePerNight}
                  </div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error fetching featured homes:", error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Unable to load featured homes at the moment.</p>
        <p className="text-gray-500 mt-2">Please try again later.</p>
      </div>
    )
  }
}