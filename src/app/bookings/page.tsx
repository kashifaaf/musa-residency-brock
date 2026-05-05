import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/db"
import { bookings, homes, users } from "@/db/schema"
import { eq, or, desc } from "drizzle-orm"
import { BookingCard } from "@/components/bookings/BookingCard"
import { alias } from "drizzle-orm/pg-core"

const guestUser = alias(users, "guest_user")
const hostUser = alias(users, "host_user")

export default async function BookingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const db = getDb()

  // Get bookings where user is either guest or host
  const userBookings = await db
    .select({
      booking: bookings,
      home: homes,
      guest: {
        id: guestUser.id,
        name: guestUser.name,
        email: guestUser.email,
        image: guestUser.image,
      },
      host: {
        id: hostUser.id,
        name: hostUser.name,
        email: hostUser.email,
        image: hostUser.image,
      },
    })
    .from(bookings)
    .leftJoin(homes, eq(bookings.homeId, homes.id))
    .leftJoin(guestUser, eq(bookings.guestId, guestUser.id))
    .leftJoin(hostUser, eq(bookings.hostId, hostUser.id))
    .where(or(
      eq(bookings.guestId, session.user.id),
      eq(bookings.hostId, session.user.id)
    ))
    .orderBy(desc(bookings.createdAt))

  const guestBookings = userBookings.filter(b => b.booking.guestId === session.user.id)
  const hostBookings = userBookings.filter(b => b.booking.hostId === session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Trips</h2>
            <div className="space-y-4">
              {guestBookings.length > 0 ? (
                guestBookings.map((booking) => (
                  <BookingCard
                    key={booking.booking.id}
                    booking={booking.booking}
                    home={booking.home}
                    host={booking.host}
                    guest={booking.guest}
                    userRole="guest"
                  />
                ))
              ) : (
                <p className="text-gray-500">No trips booked yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hosting Requests</h2>
            <div className="space-y-4">
              {hostBookings.length > 0 ? (
                hostBookings.map((booking) => (
                  <BookingCard
                    key={booking.booking.id}
                    booking={booking.booking}
                    home={booking.home}
                    host={booking.host}
                    guest={booking.guest}
                    userRole="host"
                  />
                ))
              ) : (
                <p className="text-gray-500">No hosting requests yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}