import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { bookings, homes, users } from "@/lib/db/schema"
import { eq, or } from "drizzle-orm"
import { BookingCard } from "@/components/BookingCard"
import type { BookingWithDetails } from "@/lib/types"

export default async function BookingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  const db = getDb()
  
  try {
    const userBookings = await db
      .select({
        id: bookings.id,
        homeId: bookings.homeId,
        guestId: bookings.guestId,
        hostId: bookings.hostId,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        stripePaymentIntentId: bookings.stripePaymentIntentId,
        requestMessage: bookings.requestMessage,
        responseMessage: bookings.responseMessage,
        requestedAt: bookings.requestedAt,
        respondedAt: bookings.respondedAt,
        expiresAt: bookings.expiresAt,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        home: {
          title: homes.title,
          city: homes.city,
          country: homes.country,
          photos: homes.photos,
        },
        guest: {
          name: users.name,
          image: users.image,
        },
        host: {
          name: users.name,
          image: users.image,
        }
      })
      .from(bookings)
      .innerJoin(homes, eq(bookings.homeId, homes.id))
      .innerJoin(users, eq(bookings.guestId, users.id))
      .where(or(
        eq(bookings.guestId, session.user?.id!),
        eq(bookings.hostId, session.user?.id!)
      ))
      .orderBy(bookings.requestedAt)

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Bookings</h1>
        
        {userBookings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-600">
              Start exploring creative spaces or list your own to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking as BookingWithDetails}
                currentUserId={session.user?.id!}
              />
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error loading bookings:", error)
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600">
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}