"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, MessageSquare } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { approveBooking, declineBooking, cancelBooking } from '@/actions/booking';
import type { BookingWithDetails } from '@/types';

interface BookingDetailsProps {
  booking: BookingWithDetails;
  isHost: boolean;
}

export function BookingDetails({ booking, isHost }: BookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    declined: 'destructive',
    cancelled: 'secondary',
    completed: 'default',
  } as const;

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await approveBooking(booking.id);
      if (result.success) {
        toast.success('Booking approved!');
      } else {
        toast.error(result.error || 'Failed to approve booking');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      const result = await declineBooking(booking.id);
      if (result.success) {
        toast.success('Booking declined');
      } else {
        toast.error(result.error || 'Failed to decline booking');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    setIsLoading(true);
    try {
      const result = await cancelBooking(booking.id, cancellationReason);
      if (result.success) {
        toast.success('Booking cancelled');
      } else {
        toast.error(result.error || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const otherUser = isHost ? booking.guest : booking.host;

  return (
    <div className="space-y-6">
      {/* Booking Status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Booking Details</CardTitle>
            <Badge variant={statusColors[booking.status]}>
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{booking.home.title}</h3>
            <p className="text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {booking.home.city}, {booking.home.country}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-medium">{formatDate(booking.checkIn, 'PP')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-medium">{formatDate(booking.checkOut, 'PP')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>{booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{formatCurrency(booking.totalPrice)}</p>
            </div>
          </div>

          {booking.message && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Message from guest:</p>
              <p className="p-3 bg-gray-50 rounded-lg">{booking.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other User Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isHost ? 'Guest Information' : 'Host Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={otherUser.profileImage || ''} />
              <AvatarFallback>
                {otherUser.name?.charAt(0) || otherUser.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{otherUser.name || 'User'}</p>
              <p className="text-sm text-gray-600">{otherUser.email}</p>
              {otherUser.location && (
                <p className="text-sm text-gray-600">{otherUser.location}</p>
              )}
            </div>
          </div>
          {otherUser.bio && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">About</p>
              <p className="text-sm">{otherUser.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {booking.status === 'pending' && isHost && (
        <Card>
          <CardHeader>
            <CardTitle>Respond to Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={handleApprove} 
                disabled={isLoading}
                className="flex-1"
              >
                Approve
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDecline} 
                disabled={isLoading}
                className="flex-1"
              >
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancellation */}
      {(booking.status === 'pending' || booking.status === 'approved') && (
        <Card>
          <CardHeader>
            <CardTitle>Cancel Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Please provide a reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
            />
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              disabled={isLoading || !cancellationReason.trim()}
            >
              Cancel Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}