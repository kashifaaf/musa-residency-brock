import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { bookingRequests, homes, users, homeImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatDate, formatCurrency, getDaysBetween } from "@/lib/utils";
import { BookingStatus } from "@/types";
import { BookingActions } from "@/components/bookings/BookingActions";
import { MessagesSection } from "@/components/bookings/MessagesSection";
import Link from "next/link";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/signin");
  }

  const db = getDb();

  // Get booking with all details
  const bookingData = await db
    .select({
      booking: bookingRequests,
      home: homes,
      guest: users,
      host: users,
      image: homeImages,
    })
    .from(bookingRequests)
    .leftJoin(homes, eq(homes.id, bookingRequests.homeId))
    .leftJoin(users, eq(users.id, bookingRequests.guestId))
    .leftJoin(users, eq(users.id, bookingRequests.hostId))
    .leftJoin(homeImages, eq(homeImages.homeId, homes.id))
    .where(eq(bookingRequests.id, id));

  if (
    bookingData.length === 0 ||
    !bookingData[0].home ||
    !bookingData[0].guest ||
    !bookingData[0].host
  ) {
    notFound();
  }

  const booking = bookingData[0].booking;
  const home = bookingData[0].home;
  const guest = bookingData[0].guest;
  const host = bookingData[0].host;
  const image = bookingData.find((row) => row.image)?.image;

  // Check if user is involved in this booking
  if (user.id !== booking.guestId && user.id !== booking.hostId) {
    notFound();
  }

  const isHost = user.id === booking.hostId;
  const nights = getDaysBetween(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/bookings"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to bookings
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="mb-6 text-3xl font-bold">Booking Details</h1>

            {/* Status */}
            <div className="mb-6">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
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

            {/* Home Info */}
            <div className="mb-8 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">{home.title}</h2>
              <p className="text-muted-foreground">
                {home.city}, {home.country}
              </p>
              <Link
                href={`/homes/${home.id}`}
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                View listing →
              </Link>
            </div>

            {/* Booking Info */}
            <div className="mb-8 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Trip Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium">{formatDate(booking.checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">{formatDate(booking.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">{booking.guests}</span>
                </div>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(Number(booking.totalPrice))}</span>
                </div>
                {booking.paidAt && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Paid on {formatDate(booking.paidAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Guest/Host Info */}
            <div className="mb-8 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">
                {isHost ? "Guest Information" : "Host Information"}
              </h2>
              <div>
                <p className="font-medium">{isHost ? guest.name : host.name}</p>
                {(isHost ? guest.bio : host.bio) && (
                  <p className="mt-2 text-muted-foreground">
                    {isHost ? guest.bio : host.bio}
                  </p>
                )}
                {(isHost ? guest.location : host.location) && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    From {isHost ? guest.location : host.location}
                  </p>
                )}
              </div>
            </div>

            {/* Initial Message */}
            {booking.message && (
              <div className="mb-8 rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">Initial Message</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {booking.message}
                </p>
              </div>
            )}

            {/* Actions */}
            {booking.status === BookingStatus.PENDING && (
              <BookingActions booking={booking} isHost={isHost} />
            )}
          </div>

          {/* Messages Sidebar */}
          <div className="lg:col-span-1">
            <MessagesSection
              bookingId={booking.id}
              currentUserId={user.id}
              otherUserId={isHost ? booking.guestId : booking.hostId}
              otherUserName={isHost ? guest.name || "Guest" : host.name || "Host"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}