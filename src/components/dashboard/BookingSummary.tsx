import { getDb } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, Home, User } from 'lucide-react';

interface BookingSummaryProps {
  userId: string;
}

export async function BookingSummary({ userId }: BookingSummaryProps) {
  const db = getDb();
  
  const [guestBookings, hostBookings] = await Promise.all([
    db.query.bookings.findMany({
      where: (bookings, { eq }) => eq(bookings.guestId, userId),
      with: {
        home: true,
      },
      orderBy: (bookings, { desc }) => desc(bookings.createdAt),
      limit: 5,
    }),
    db.query.bookings.findMany({
      where: (bookings, { eq }) => eq(bookings.hostId, userId),
      with: {
        home: true,
        guest: true,
      },
      orderBy: (bookings, { desc }) => desc(bookings.createdAt),
      limit: 5,
    }),
  ]);

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    declined: 'destructive',
    cancelled: 'secondary',
    completed: 'default',
  } as const;

  return (
    <div className="space-y-6">
      {/* Guest Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          {guestBookings.length === 0 ? (
            <p className="text-gray-500">No trips booked yet</p>
          ) : (
            <div className="space-y-4">
              {guestBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="block p-4 rounded-lg border hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{booking.home.title}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(booking.checkIn, 'PP')} - {formatDate(booking.checkOut, 'PP')}
                      </p>
                    </div>
                    <Badge variant={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Host Bookings */}
      {hostBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Hosting Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hostBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="block p-4 rounded-lg border hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{booking.home.title}</h4>
                      <p className="text-sm text-gray-600">
                        Guest: {booking.guest.name || booking.guest.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(booking.checkIn, 'PP')} - {formatDate(booking.checkOut, 'PP')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}