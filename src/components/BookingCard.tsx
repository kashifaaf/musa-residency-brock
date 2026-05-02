'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { BookingRequestWithDetails } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { approveBookingRequest, declineBookingRequest } from '@/app/actions/bookings';

interface BookingCardProps {
  booking: BookingRequestWithDetails;
  currentUserId: string;
}

export function BookingCard({ booking, currentUserId }: BookingCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(booking.status);
  
  const isHost = currentUserId !== booking.guest.id;
  const canRespond = isHost && status === 'pending';

  const handleApprove = async () => {
    setLoading(true);
    try {
      const result = await approveBookingRequest(booking.id);
      if (result.success) {
        setStatus('approved');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to approve booking');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      const result = await declineBookingRequest(booking.id);
      if (result.success) {
        setStatus('declined');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to decline booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'declined': return 'text-red-600 bg-red-50';
      case 'paid': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{booking.home.title}</h3>
              <p className="text-sm text-gray-600">{booking.home.location}</p>
            </div>
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Dates</h4>
              <p className="text-sm text-gray-600">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900">Guests</h4>
              <p className="text-sm text-gray-600">{booking.guestCount}</p>
            </div>
            
            {booking.totalAmount && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Total</h4>
                <p className="text-sm text-gray-600">{formatCurrency(booking.totalAmount)}</p>
              </div>
            )}
          </div>

          {isHost ? (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Guest</h4>
              <div className="mt-2 flex items-start space-x-3">
                {booking.guest.profilePhoto ? (
                  <img
                    src={booking.guest.profilePhoto}
                    alt={booking.guest.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {booking.guest.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{booking.guest.name}</p>
                  {booking.guest.location && (
                    <p className="text-sm text-gray-600">{booking.guest.location}</p>
                  )}
                  {booking.message && (
                    <p className="mt-2 text-sm text-gray-700">{booking.message}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            booking.message && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Your message</h4>
                <p className="mt-1 text-sm text-gray-700">{booking.message}</p>
              </div>
            )
          )}

          {canRespond && (
            <div className="mt-6 flex space-x-3">
              <Button
                onClick={handleApprove}
                loading={loading}
                size="sm"
              >
                Approve
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                loading={loading}
                size="sm"
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}