import { notFound } from "next/navigation"
import { getDb } from "@/lib/db"
import { homes, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { HomeDetails } from "@/components/HomeDetails"
import { BookingForm } from "@/components/BookingForm"
import { auth } from "@/lib/auth"
import type { HomeWithHost } from "@/lib/types"

interface HomePageProps {
  params: Promise<{ id: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { id } = await params
  const session = await auth()
  const db = getDb()
  
  try {
    const result = await db
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
        host: {
          id: users.id,
          name: users.name,
          image: users.image,
          location: users.location,
        }
      })
      .from(homes)
      .innerJoin(users, eq(homes.hostId, users.id))
      .where(eq(homes.id, id))
      .limit(1)

    if (result.length === 0) {
      notFound()
    }

    const home = result[0] as HomeWithHost

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HomeDetails home={home} />
          </div>
          
          <div className="lg:col-span-1">
            {session && session.user?.id !== home.host.id ? (
              <BookingForm home={home} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-center">
                  {session ? "You cannot book your own home" : "Sign in to book this home"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading home:", error)
    notFound()
  }
}