import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { bookings, listings, users, payments, listingPhotos } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { BookingDetail } from "@/components/booking/BookingDetail";
import type { BookingWithRelations } from "@/types";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const db = getDb();

  const bookingData = await db
    .select({
      booking: bookings,
      listing: listings,
      guest: users,
      host: users,
      payment: payments,
    })
    .from(bookings)
    .leftJoin(listings, eq(bookings.listingId, listings.id))
    .leftJoin(users, eq(bookings.guestId, users.id))
    .leftJoin(users, eq(bookings.hostId, users.id))
    .leftJoin(payments, eq(payments.bookingId, bookings.id))
    .where(and(
      eq(bookings.id, id),
      or(
        eq(bookings.guestId, session.user.id),
        eq(bookings.hostId, session.user.id)
      )
    ));

  if (!bookingData.length || !bookingData[0].listing || !bookingData[0].guest || !bookingData[0].host) {
    notFound();
  }

  // Get listing photos
  const photos = await db
    .select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, bookingData[0].listing.id))
    .orderBy(listingPhotos.order);

  const booking: BookingWithRelations = {
    ...bookingData[0].booking,
    listing: {
      ...bookingData[0].listing,
      host: bookingData[0].host,
      photos,
    },
    guest: bookingData[0].guest,
    host: bookingData[0].host,
    payment: bookingData[0].payment || undefined,
  };

  const isHost = session.user.id === booking.hostId;

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingDetail booking={booking} isHost={isHost} />
    </div>
  );
}