'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toaster';
import { formatCurrency, calculateNights } from '@/lib/utils';
import type { Home } from '@/lib/types';

interface BookingFormProps {
  home: Home;
  availableDates: Array<{ startDate: Date; endDate: Date }>;
  currentUserId: string;
}

export function BookingForm({ home, currentUserId }: BookingFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const nights = startDate && endDate ? calculateNights(new Date(startDate), new Date(endDate)) : 0;
  const totalPrice = nights * parseFloat(home.pricePerNight);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeId: home.id,
          startDate,
          endDate,
          guestCount,
          message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast('Booking request sent! The host will respond within 24 hours.', 'success');
        // Reset form
        setStartDate('');
        setEndDate('');
        setGuestCount(1);
        setMessage('');
      } else {
        toast(result.error, 'error');
      }
    } catch (error) {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="text-2xl font-bold">{formatCurrency(parseFloat(home.pricePerNight))}</div>
        <div className="text-gray-600">per night</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Check in</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Check out</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guestCount">Guests</Label>
          <Input
            id="guestCount"
            type="number"
            min="1"
            max={home.maxGuests}
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Message to host</Label>
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
              <span>{formatCurrency(parseFloat(home.pricePerNight))} × {nights} nights</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !startDate || !endDate}
        >
          {isLoading ? 'Sending request...' : 'Request to Book'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        You won't be charged until your booking is approved by the host
      </p>
    </div>
  );
}