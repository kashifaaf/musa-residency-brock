import { getDb } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

interface HostBookingsProps {
  userId: string;
}

export async function HostBookings({ userId }: HostBookingsProps) {
  const db = getDb();
  
  const bookings = await db.query.bookings.findMany({
    where: (bookings, { eq }) => eq(bookings.hostId, userId),
    with: {
      home: true,
      guest: true,
    },
    orderBy: (bookings, { desc }) => desc(bookings.createdAt),
  });

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    declined: 'destructive',
    cancelled: 'secondary',
    completed: 'default',
  } as const;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No booking requests yet.</p>
        <Button asChild>
          <Link href="/host">Manage Your Homes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{booking.home.title}</CardTitle>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <User className="h-3 w-3 mr-1" />
                  {booking.guest.name || booking.guest.email}
                </p>
              </div>
              <Badge variant={statusColors[booking.status]}>
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(booking.checkIn, 'PP')} - {formatDate(booking.checkOut, 'PP')}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/bookings/${booking.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}