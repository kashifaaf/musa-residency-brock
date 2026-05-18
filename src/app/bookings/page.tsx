import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings } from "@/lib/db/schema"
import { eq, or, desc } from "drizzle-orm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BookingCard } from "@/components/BookingCard"
import type { BookingWithDetails } from "@/types"

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const userId = session.user.id

  const allBookings = (await db.query.bookings.findMany({
    where: or(eq(bookings.guestId, userId), eq(bookings.hostId, userId)),
    with: {
      listing: { with: { photos: true } },
      guest: {
        columns: { id: true, name: true, image: true, location: true, bio: true, workInfo: true, socialLinks: true },
      },
      host: {
        columns: { id: true, name: true, image: true },
      },
      payment: true,
    },
    orderBy: [desc(bookings.createdAt)],
  })) as BookingWithDetails[]

  const asGuest = allBookings.filter((b) => b.guestId === userId)
  const asHost = allBookings.filter((b) => b.hostId === userId)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Your Bookings</h1>

          {asGuest.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">As Guest</h2>
              <div className="space-y-4">
                {asGuest.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} role="guest" />
                ))}
              </div>
            </section>
          )}

          {asHost.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">As Host</h2>
              <div className="space-y-4">
                {asHost.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} role="host" />
                ))}
              </div>
            </section>
          )}

          {allBookings.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-foreground">No bookings yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse available homes and make your first booking request.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}