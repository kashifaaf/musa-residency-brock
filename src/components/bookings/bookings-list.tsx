import { BookingCard } from './booking-card';
import type { BookingRequest } from '@/lib/types';

interface BookingsListProps {
  bookings: Array<BookingRequest & {
    home?: { id: string; title: string; location: string; photos?: string[] };
    guest?: { id: string; name: string; email: string; profilePhoto?: string };
  }>;
  userRole: 'guest' | 'host';
}

export function BookingsList({ bookings, userRole }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          {userRole === 'guest' ? 'No trips booked yet' : 'No hosting requests yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} userRole={userRole} />
      ))}
    </div>
  );
}