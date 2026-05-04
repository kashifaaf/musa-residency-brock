"use client";

import { useState } from 'react';
import { approveBookingRequest, declineBookingRequest } from '@/lib/actions/bookings';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface BookingRequestCardProps {
  request: {
    id: string;
    homeTitle: string;
    guestName: string;
    guestEmail: string;
    guestBio?: string;
    startDate: Date;
    endDate: Date;
    totalPrice: string;
    status: string;
    guestMessage?: string;
    hostResponse?: string;
    createdAt: Date;
    expiresAt: Date;
  };
}

export function BookingRequestCard({ request }: BookingRequestCardProps) {
  const [hostResponse, setHostResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(request.status);

  const isExpired = new Date() > request.expiresAt;
  const isPending = currentStatus === 'pending' && !isExpired;

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveBookingRequest(request.id, hostResponse);
    
    if (result.success) {
      setCurrentStatus('approved');
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  const handleDecline = async () => {
    setIsLoading(true);
    const result = await declineBookingRequest(request.id, hostResponse);
    
    if (result.success) {
      setCurrentStatus('declined');
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return isExpired ? 'text-muted-foreground' : 'text-orange-600';
      case 'approved':
        return 'text-green-600';
      case 'declined':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'pending' && isExpired) {
      return 'Expired';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{request.homeTitle}</CardTitle>
          <span className={`text-sm font-medium ${getStatusColor(currentStatus)}`}>
            {getStatusText(currentStatus)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Guest Information</h4>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {request.guestName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {request.guestEmail}
            </p>
            {request.guestBio && (
              <p className="text-sm mt-2">
                <span className="font-medium">Bio:</span> {request.guestBio}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Booking Details</h4>
            <p className="text-sm">
              <span className="font-medium">Dates:</span>{' '}
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Total Price:</span>{' '}
              {formatCurrency(request.totalPrice)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Requested:</span>{' '}
              {formatDate(request.createdAt)}
            </p>
            {isPending && (
              <p className="text-sm text-orange-600">
                <span className="font-medium">Expires:</span>{' '}
                {formatDate(request.expiresAt)}
              </p>
            )}
          </div>
        </div>

        {request.guestMessage && (
          <div>
            <h4 className="font-medium mb-2">Guest Message</h4>
            <p className="text-sm bg-muted p-3 rounded-md">
              {request.guestMessage}
            </p>
          </div>
        )}

        {request.hostResponse && (
          <div>
            <h4 className="font-medium mb-2">Your Response</h4>
            <p className="text-sm bg-muted p-3 rounded-md">
              {request.hostResponse}
            </p>
          </div>
        )}

        {isPending && (
          <div className="space-y-3">
            <div>
              <label htmlFor={`response-${request.id}`} className="text-sm font-medium">
                Response Message (optional)
              </label>
              <Textarea
                id={`response-${request.id}`}
                placeholder="Add a message to the guest..."
                value={hostResponse}
                onChange={(e) => setHostResponse(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Approve & Charge'}
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Decline'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}