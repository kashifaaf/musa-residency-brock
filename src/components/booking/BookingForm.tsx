'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createBookingRequest } from '@/lib/actions/booking';
import { calculateNights, formatCurrency } from '@/lib/utils';

interface BookingFormProps {
  home: {
    id: string;
    pricePerNight: string;
    maxGuests: number;
    hostId: string;
  };
}

export function BookingForm({ home }: BookingFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guests: '2',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const nights = calculateNights(start, end);
    const pricePerNight = parseFloat(home.pricePerNight);
    
    return nights * pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setError('You must be signed in to make a booking request');
      return;
    }

    if (session.user?.id === home.hostId) {
      setError('You cannot book your own home');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate >= endDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (startDate < new Date()) {
      setError('Check-in date cannot be in the past');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await createBookingRequest({
        homeId: home.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guests: parseInt(formData.guests),
        message: formData.message,
      });

      if (result.success) {
        // Redirect to booking confirmation or dashboard
        window.location.href = `/bookings/${result.data.id}`;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = calculateTotal();
  const nights = formData.startDate && formData.endDate 
    ? calculateNights(new Date(formData.startDate), new Date(formData.endDate))
    : 0;

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Sign in to make a booking request</p>
        <Button onClick={() => window.location.href = '/api/auth/signin'}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <Input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max={home.maxGuests}
            value={formData.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message to host (optional)
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell the host about yourself and why you'd like to stay..."
            rows={4}
            value={formData.message}
            onChange={handleChange}
          />
        </div>
      </div>

      {total > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>{formatCurrency(home.pricePerNight)} x {nights} nights</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Request to Book'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        You won't be charged yet. The host will review your request and you'll only pay if approved.
      </p>
    </form>
  );
}