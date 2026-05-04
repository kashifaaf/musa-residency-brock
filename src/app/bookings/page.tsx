import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getBookingRequests } from '@/lib/actions/bookings';
import { BookingRequestCard } from '@/components/bookings/booking-request-card';

export default async function BookingsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const result = await getBookingRequests();
  const bookingRequests = result.success ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Booking Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage booking requests for your listed homes.
        </p>
      </div>

      {bookingRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No booking requests yet</h3>
          <p className="text-muted-foreground">
            When guests request to book your homes, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookingRequests.map((request) => (
            <BookingRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}