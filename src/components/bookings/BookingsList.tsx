import { formatDate, formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Booking, Listing, User } from '@/lib/db/schema';

interface BookingWithRelations extends Booking {
  listing?: Listing;
  host?: User;
  guest?: User;
}

interface BookingsListProps {
  bookings: Array<{ booking: Booking; listing?: Listing | null; host?: User | null; guest?: User | null }>;
  userId: string;
  isHost: boolean;
}

export function BookingsList({ bookings, userId, isHost }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          {isHost ? "You haven't received any booking requests yet." : "You haven't made any bookings yet."}
        </p>
        {!isHost && (
          <Button asChild className="mt-4">
            <Link href="/listings">Browse Listings</Link>
          </Button>
        )}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map(({ booking, listing, host, guest }) => {
        const otherUser = isHost ? guest : host;
        
        return (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {listing?.title || 'Unknown Listing'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing?.location || 'Unknown Location'}
                  </p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm text-muted-foreground">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm text-muted-foreground">{formatDate(booking.checkOut)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{isHost ? 'Guest' : 'Host'}</p>
                  <p className="text-sm text-muted-foreground">{otherUser?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Price</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(booking.totalPrice, booking.currency)}
                  </p>
                </div>
              </div>

              {booking.guestMessage && (
                <div>
                  <p className="text-sm font-medium">Message</p>
                  <p className="text-sm text-muted-foreground">{booking.guestMessage}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {booking.status === 'pending' && isHost && (
                  <>
                    <Button asChild size="sm">
                      <Link href={`/bookings/${booking.id}/respond`}>Respond</Link>
                    </Button>
                  </>
                )}
                {booking.status === 'approved' && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/bookings/${booking.id}`}>View Details</Link>
                  </Button>
                )}
                {listing && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/listings/${listing.id}`}>View Listing</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}