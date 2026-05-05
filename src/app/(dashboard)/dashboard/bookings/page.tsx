import { requireAuth } from '@/lib/session';
import { getDb } from '@/lib/db';
import { bookingRequests, homes, users } from '@/lib/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { BookingsList } from '@/components/bookings/bookings-list';
import { BookingsTabs } from '@/components/bookings/bookings-tabs';

export default async function BookingsPage() {
  const session = await requireAuth();
  const db = getDb();

  const allBookings = await db
    .select({
      id: bookingRequests.id,
      homeId: bookingRequests.homeId,
      guestId: bookingRequests.guestId,
      hostId: bookingRequests.hostId,
      startDate: bookingRequests.startDate,
      endDate: bookingRequests.endDate,
      totalPrice: bookingRequests.totalPrice,
      guestCount: bookingRequests.guestCount,
      message: bookingRequests.message,
      status: bookingRequests.status,
      hostResponseDeadline: bookingRequests.hostResponseDeadline,
      createdAt: bookingRequests.createdAt,
      home: {
        id: homes.id,
        title: homes.title,
        location: homes.location,
        photos: homes.photos,
      },
      guest: {
        id: users.id,
        name: users.name,
        email: users.email,
        profilePhoto: users.profilePhoto,
      },
    })
    .from(bookingRequests)
    .innerJoin(homes, eq(bookingRequests.homeId, homes.id))
    .innerJoin(users, eq(bookingRequests.guestId, users.id))
    .where(
      or(
        eq(bookingRequests.guestId, session.userId),
        eq(bookingRequests.hostId, session.userId)
      )
    )
    .orderBy(desc(bookingRequests.createdAt));

  const myTrips = allBookings.filter(b => b.guestId === session.userId);
  const myHosting = allBookings.filter(b => b.hostId === session.userId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <BookingsTabs myTrips={myTrips} myHosting={myHosting} />
    </div>
  );
}