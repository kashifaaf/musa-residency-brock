import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { bookings, listings, users } from '@/lib/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { BookingsList } from '@/components/bookings/BookingsList';
import { BookingTabs } from '@/components/bookings/BookingTabs';

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const userId = session.user.id;
  const tab = searchParams.tab || 'guest';

  const userBookings = await db.select({
    booking: bookings,
    listing: listings,
    host: users,
    guest: users,
  })
  .from(bookings)
  .leftJoin(listings, eq(bookings.listingId, listings.id))
  .leftJoin(users, eq(bookings.hostId, users.id))
  .where(
    tab === 'host' 
      ? eq(bookings.hostId, userId)
      : eq(bookings.guestId, userId)
  )
  .orderBy(desc(bookings.createdAt));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      <BookingTabs activeTab={tab} />
      
      <div className="mt-8">
        <BookingsList bookings={userBookings} userId={userId} isHost={tab === 'host'} />
      </div>
    </div>
  );
}