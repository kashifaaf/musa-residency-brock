import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface BookingCardProps {
  booking: {
    id: string;
    startDate: Date;
    endDate: Date;
    guests: number;
    totalAmount: string;
    status: string;
    createdAt: Date;
    expiresAt: Date;
    home?: {
      id: string;
      title: string;
      location: string;
      host?: {
        name: string;
      };
    };
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Host Response';
      case 'approved':
        return 'Approved - Payment Required';
      case 'declined':
        return 'Declined';
      case 'paid':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.home?.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>
          
          <p className="text-gray-600 mb-2">{booking.home?.location}</p>
          <p className="text-gray-600 mb-2">
            Hosted by {booking.home?.host?.name}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
            <span>{booking.guests} guests</span>
            <span>{formatCurrency(booking.totalAmount)} total</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link href={`/bookings/${booking.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            
            {booking.status === 'approved' && (
              <Link href={`/bookings/${booking.id}/payment`}>
                <Button size="sm">
                  Complete Payment
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}