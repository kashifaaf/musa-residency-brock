'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice, calculateNights } from '@/lib/utils';
import { createBooking } from '@/actions/bookings';
import { useToast } from '@/hooks/use-toast';
import type { Listing } from '@/lib/db/schema';

interface BookingCardProps {
  listing: Listing;
  isAvailable: boolean;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function BookingCard({ listing, isAvailable, checkIn, checkOut, guests = 2 }: BookingCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    guestCount: guests,
    guestMessage: '',
  });

  const nights = bookingData.checkIn && bookingData.checkOut
    ? calculateNights(bookingData.checkIn, bookingData.checkOut)
    : 0;
  
  const totalPrice = nights * parseFloat(listing.pricePerNight);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (nights < 30) {
      toast({
        title: 'Minimum stay required',
        description: 'This listing requires a minimum stay of 30 nights.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        listingId: listing.id,
        checkIn: new Date(bookingData.checkIn),
        checkOut: new Date(bookingData.checkOut),
        guestCount: bookingData.guestCount,
        guestMessage: bookingData.guestMessage,
        totalPrice,
        currency: listing.currency,
      });

      if (result.success && result.data) {
        toast({
          title: 'Booking request sent!',
          description: 'The host has 24 hours to respond to your request.',
        });
        router.push(`/bookings?tab=guest`);
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>
          <span>{formatPrice(listing.pricePerNight, listing.currency)}</span>
          <span className="text-base font-normal text-muted-foreground"> / night</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in</Label>
              <Input
                id="checkIn"
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out</Label>
              <Input
                id="checkOut"
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="guestCount">Guests</Label>
            <Input
              id="guestCount"
              type="number"
              min="1"
              max={listing.maxGuests}
              value={bookingData.guestCount}
              onChange={(e) => setBookingData({ ...bookingData, guestCount: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="guestMessage">Message to host (optional)</Label>
            <Textarea
              id="guestMessage"
              placeholder="Tell the host about yourself and your trip..."
              value={bookingData.guestMessage}
              onChange={(e) => setBookingData({ ...bookingData, guestMessage: e.target.value })}
              rows={3}
            />
          </div>

          {nights > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>{formatPrice(listing.pricePerNight, listing.currency)} × {nights} nights</span>
                <span>{formatPrice(totalPrice, listing.currency)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice, listing.currency)}</span>
              </div>
              {nights < 30 && (
                <p className="text-sm text-destructive">Minimum stay of 30 nights required</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isAvailable || isSubmitting || nights < 30}
          >
            {!isAvailable ? 'Not Available' : isSubmitting ? 'Requesting...' : 'Request to Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}