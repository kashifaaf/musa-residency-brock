import { getUserBookings } from '@/lib/actions/dashboard';
import { BookingCard } from '@/components/bookings/BookingCard';

export async function BookingsList() {
  const result = await getUserBookings();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading bookings: {result.error}</p>
      </div>
    );
  }

  const bookings = result.data;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
        <p className="text-gray-600 mt-2">
          When you make booking requests, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}