import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { bookingRequests, homes, users } from "@/lib/db/schema";
import { eq, or, desc } from "drizzle-orm";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default async function BookingsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/signin");
  }

  const db = getDb();

  // Get all bookings where user is either host or guest
  const bookings = await db
    .select({
      booking: bookingRequests,
      home: homes,
      guest: users,
      host: users,
    })
    .from(bookingRequests)
    .leftJoin(homes, eq(homes.id, bookingRequests.homeId))
    .leftJoin(users, eq(users.id, bookingRequests.guestId))
    .leftJoin(users, eq(users.id, bookingRequests.hostId))
    .where(
      or(
        eq(bookingRequests.hostId, user.id),
        eq(bookingRequests.guestId, user.id)
      )
    )
    .orderBy(desc(bookingRequests.createdAt));

  const hostBookings = bookings.filter((b) => b.booking.hostId === user.id);
  const guestBookings = bookings.filter((b) => b.booking.guestId === user.id);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Your Bookings</h1>

        {/* Host Bookings */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Hosting</h2>
          {hostBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hostBookings.map(({ booking, home, guest }) => (
                <Link key={booking.id} href={`/bookings/${booking.id}`}>
                  <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold">{home?.title || "Unknown Home"}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          booking.status === BookingStatus.APPROVED
                            ? "bg-success/10 text-success"
                            : booking.status === BookingStatus.PENDING
                            ? "bg-primary/10 text-primary"
                            : booking.status === BookingStatus.DECLINED
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Guest: {guest?.name || "Unknown"}
                    </p>
                    <p className="mt-2 text-sm">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </p>
                    <p className="mt-1 font-medium">
                      {formatCurrency(Number(booking.totalPrice))}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No hosting bookings yet.</p>
            </Card>
          )}
        </section>

        {/* Guest Bookings */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Traveling</h2>
          {guestBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {guestBookings.map(({ booking, home, host }) => (
                <Link key={booking.id} href={`/bookings/${booking.id}`}>
                  <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold">{home?.title || "Unknown Home"}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          booking.status === BookingStatus.APPROVED
                            ? "bg-success/10 text-success"
                            : booking.status === BookingStatus.PENDING
                            ? "bg-primary/10 text-primary"
                            : booking.status === BookingStatus.DECLINED
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Host: {host?.name || "Unknown"}
                    </p>
                    <p className="mt-2 text-sm">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </p>
                    <p className="mt-1 font-medium">
                      {formatCurrency(Number(booking.totalPrice))}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No travel bookings yet.</p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}