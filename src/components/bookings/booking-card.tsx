'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { BookingRequest } from '@/lib/types';

interface BookingCardProps {
  booking: BookingRequest & {
    home?: { id: string; title: string; location: string; photos?: string[] };
    guest?: { id: string; name: string; email: string; profilePhoto?: string };
  };
  userRole: 'guest' | 'host';
}

export function BookingCard({ booking, userRole }: BookingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const statusColor = {
    pending: 'text-yellow-600 bg-yellow-100',
    approved: 'text-green-600 bg-green-100',
    declined: 'text-red-600 bg-red-100',
    paid: 'text-blue-600 bg-blue-100',
    cancelled: 'text-gray-600 bg-gray-100',
  }[booking.status];

  async function handleApprove() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}/approve`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        toast('Booking approved successfully!', 'success');
        window.location.reload();
      } else {
        toast(result.error, 'error');
      }
    } catch (error) {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDecline() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}/decline`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        toast('Booking declined.', 'info');
        window.location.reload();
      } else {
        toast(result.error, 'error');
      }
    } catch (error) {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const mainPhoto = booking.home?.photos?.[0] || '/placeholder-home.jpg';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 relative rounded-lg overflow-hidden">
            <Image
              src={mainPhoto}
              alt={booking.home?.title || 'Home'}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{booking.home?.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-2">{booking.home?.location}</p>

          <div className="text-sm text-gray-600 space-y-1">
            <div>
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </div>
            <div>{booking.guestCount} guests</div>
            <div className="font-medium">{formatCurrency(parseFloat(booking.totalPrice))}</div>
          </div>

          {booking.message && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">"{booking.message}"</p>
            </div>
          )}

          {userRole === 'host' && booking.guest && (
            <div className="mt-3 flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2">
                {booking.guest.profilePhoto && (
                  <Image
                    src={booking.guest.profilePhoto}
                    alt={booking.guest.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
              </div>
              <span className="text-sm text-gray-600">Guest: {booking.guest.name}</span>
            </div>
          )}
        </div>

        {userRole === 'host' && booking.status === 'pending' && (
          <div className="flex flex-col gap-2 min-w-[120px]">
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              size="sm"
            >
              Approve
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}