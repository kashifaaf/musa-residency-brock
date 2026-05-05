import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { bookings, homes, users } from "@/lib/db/schema"
import { eq, or, desc } from "drizzle-orm"
import { BookingCard } from "@/components/BookingCard"

export default async function BookingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Get bookings where user is either guest or host
  const userBookings = await db
    .select({
      booking: bookings,
      home: homes,
      guest: users,
    })
    .from(bookings)
    .leftJoin(homes, eq(bookings.homeId, homes.id))
    .leftJoin(users, eq(bookings.guestId, users.id))
    .where(
      or(
        eq(bookings.guestId, session.user.id),
        eq(bookings.hostId, session.user.id)
      )
    )
    .orderBy(desc(bookings.createdAt))

  // Get host data separately for host bookings
  const hostBookingsData = await db
    .select({
      booking: bookings,
      home: homes,
      host: users,
    })
    .from(bookings)
    .leftJoin(homes, eq(bookings.homeId, homes.id))
    .leftJoin(users, eq(bookings.hostId, users.id))
    .where(eq(bookings.hostId, session.user.id))
    .orderBy(desc(bookings.createdAt))

  // Separate bookings by type
  const guestBookings = userBookings.filter(b => b.booking.guestId === session.user.id)
  const hostBookings = hostBookingsData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guest Bookings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My Trips ({guestBookings.length})
          </h2>
          
          {guestBookings.length > 0 ? (
            <div className="space-y-4">
              {guestBookings.map(({ booking, home, guest }) => (
                <BookingCard
                  key={booking.id}
                  booking={{
                    ...booking,
                    home: home!,
                    host: guest!,
                  }}
                  isHost={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">No bookings yet</p>
              <a
                href="/search"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Start searching for homes
              </a>
            </div>
          )}
        </div>
        
        {/* Host Bookings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hosting Requests ({hostBookings.length})
          </h2>
          
          {hostBookings.length > 0 ? (
            <div className="space-y-4">
              {hostBookings.map(({ booking, home, host }) => (
                <BookingCard
                  key={booking.id}
                  booking={{
                    ...booking,
                    home: home!,
                    guest: host!,
                  }}
                  isHost={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">No hosting requests yet</p>
              <a
                href="/host/homes"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                List your home
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}