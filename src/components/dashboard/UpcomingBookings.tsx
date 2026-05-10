import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';
import type { Booking } from '@/lib/db/schema';

interface UpcomingBookingsProps {
  bookings: Booking[];
  userId: string;
}

export function UpcomingBookings({ bookings, userId }: UpcomingBookingsProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming bookings scheduled.</p>
          <Button asChild className="mt-4">
            <Link href="/listings">Browse Listings</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Bookings</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/bookings">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isHost = booking.hostId === userId;
            
            return (
              <div key={booking.id} className="border-l-4 border-primary pl-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {isHost ? 'Guest arriving' : 'Your stay'}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/bookings/${booking.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}