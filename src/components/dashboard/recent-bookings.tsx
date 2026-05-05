import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';

interface RecentBookingsProps {
  bookings: Array<{
    id: string;
    status: string;
    startDate: Date;
    endDate: Date;
    totalPrice: string;
    createdAt: Date;
    home: {
      title: string;
      location: string;
    };
  }>;
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
        <Link href="/dashboard/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium text-sm">{booking.home.title}</p>
                <p className="text-gray-600 text-xs">{booking.home.location}</p>
                <p className="text-gray-600 text-xs">
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{formatCurrency(parseFloat(booking.totalPrice))}</p>
                <p className={`text-xs px-2 py-1 rounded-full ${
                  booking.status === 'paid' ? 'bg-green-100 text-green-700' :
                  booking.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {booking.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}