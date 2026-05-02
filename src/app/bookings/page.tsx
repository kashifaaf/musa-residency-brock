import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { bookingRequests, homes, users } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { BookingCard } from '@/components/BookingCard';
import { BookingRequestWithDetails } from '@/lib/types';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user) {
    redirect('/auth/signin');
  }

  // Get bookings where user is either guest or host
  const bookingResults = await db
    .select({
      booking: bookingRequests,
      guest: users,
      home: homes,
      host: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(bookingRequests)
    .innerJoin(users, eq(bookingRequests.guestId, users.id))
    .innerJoin(homes, eq(bookingRequests.homeId, homes.id))
    .where(
      or(
        eq(bookingRequests.guestId, user.id), // User is guest
        eq(homes.hostId, user.id) // User is host
      )
    )
    .orderBy(bookingRequests.createdAt);

  const bookings: BookingRequestWithDetails[] = bookingResults.map((result) => ({
    id: result.booking.id,
    startDate: result.booking.startDate,
    endDate: result.booking.endDate,
    guestCount: result.booking.guestCount,
    message: result.booking.message,
    status: result.booking.status,
    totalAmount: result.booking.totalAmount,
    guest: {
      id: result.guest.id,
      name: result.guest.name,
      email: result.guest.email,
      bio: result.guest.bio,
      location: result.guest.location,
      workInfo: result.guest.workInfo,
      socialMedia: result.guest.socialMedia,
      profilePhoto: result.guest.profilePhoto,
    },
    home: {
      id: result.home.id,
      title: result.home.title,
      location: result.home.location,
    },
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">
          Manage your booking requests and reservations.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12a4 4 0 01-4-4v-4h8v4a4 4 0 01-4 4z" />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">No bookings yet</h3>
          <p className="mt-1 text-gray-500">
            When you make or receive booking requests, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              currentUserId={user.id} 
            />
          ))}
        </div>
      )}
    </div>
  );
}