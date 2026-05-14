"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { formatCurrency, calculateNights } from '@/lib/utils';
import { toast } from 'sonner';
import { createBooking } from '@/actions/booking';
import type { Home, Availability } from '@/types';

interface BookingCardProps {
  home: Home;
  availability: Availability[];
  isAuthenticated: boolean;
}

export function BookingCard({ home, availability, isAuthenticated }: BookingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');

  const pricePerNight = 100; // Fixed price for MVP
  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0;
  const totalPrice = nights * pricePerNight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (nights < 30) {
      toast.error('Minimum stay is 30 nights');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await createBooking({
        homeId: home.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guestCount,
        message,
      });

      if (result.success && result.data) {
        toast.success('Booking request sent! The host will respond within 24 hours.');
        router.push(`/bookings/${result.data.id}`);
      } else {
        toast.error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Book this home</CardTitle>
        <p className="text-2xl font-bold">{formatCurrency(pricePerNight)}/night</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="checkIn">Check-in</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                  min={checkIn}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="guestCount">Number of guests</Label>
            <Input
              id="guestCount"
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              min={1}
              max={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message to host (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the host about yourself and your trip..."
              rows={3}
            />
          </div>

          {nights > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>{formatCurrency(pricePerNight)} × {nights} nights</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading || !checkIn || !checkOut}
          >
            {isLoading ? 'Processing...' : isAuthenticated ? 'Request to Book' : 'Sign in to Book'}
          </Button>

          {nights > 0 && nights < 30 && (
            <p className="text-sm text-red-600 text-center">
              Minimum stay is 30 nights
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}