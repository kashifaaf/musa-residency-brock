import { getDb } from "@/lib/db"
import { homes, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { HomeCard } from "@/components/HomeCard"
import type { HomeWithHost } from "@/lib/types"

export async function FeaturedHomes() {
  const db = getDb()
  
  try {
    const featuredHomes = await db
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
      .where(eq(homes.isActive, true))
      .limit(6)

    if (featuredHomes.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No featured homes available at the moment.</p>
        </div>
      )
    }

    const homesWithHost = featuredHomes.map(home => ({
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homesWithHost.map((home) => (
          <HomeCard key={home.id} home={home as HomeWithHost} />
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error fetching featured homes:", error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading featured homes. Please try again later.</p>
      </div>
    )
  }
}