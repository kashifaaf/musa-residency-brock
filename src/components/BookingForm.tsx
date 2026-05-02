'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card } from './ui/Card';
import { calculateDays, formatCurrency } from '@/lib/utils';
import { createBookingRequest } from '@/app/actions/bookings';

interface BookingFormProps {
  homeId: string;
  maxGuests: number;
}

export function BookingForm({ homeId, maxGuests }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guestCount: 2,
    message: '',
  });

  const days = formData.startDate && formData.endDate 
    ? calculateDays(new Date(formData.startDate), new Date(formData.endDate))
    : 0;
  
  const pricePerDay = 100; // TODO: Make this configurable
  const totalAmount = days * pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      alert('Please select your dates');
      return;
    }

    setLoading(true);

    try {
      const result = await createBookingRequest({
        homeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guestCount: formData.guestCount,
        message: formData.message,
        totalAmount,
      });

      if (result.success) {
        router.push(`/bookings/${result.data}`);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            {formatCurrency(pricePerDay * 100)} <span className="text-base font-normal text-gray-600">per day</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Check-in"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          
          <Input
            label="Check-out"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
            min={formData.startDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <Input
          label="Guests"
          type="number"
          min="1"
          max={maxGuests}
          value={formData.guestCount}
          onChange={(e) => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
          required
        />

        <Textarea
          label="Message to host"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Tell the host about yourself and why you're interested in their space..."
          rows={3}
        />

        {days > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(pricePerDay * 100)} × {days} days</span>
              <span>{formatCurrency(totalAmount * 100)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalAmount * 100)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          disabled={!formData.startDate || !formData.endDate}
        >
          Request to Book
        </Button>

        <p className="text-xs text-gray-500 text-center">
          You won't be charged yet. The host has 24 hours to respond.
        </p>
      </form>
    </Card>
  );
}