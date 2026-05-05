import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { formatDate, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { BookingActions } from "@/components/BookingActions"
import type { BookingWithDetails } from "@/lib/types"

interface BookingCardProps {
  booking: BookingWithDetails
  currentUserId: string
}

export function BookingCard({ booking, currentUserId }: BookingCardProps) {
  const isHost = booking.hostId === currentUserId
  const isGuest = booking.guestId === currentUserId
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    completed: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Home Image */}
        <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden">
          <Image
            src={booking.home.photos?.[0] || "/placeholder-home.jpg"}
            alt={booking.home.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              <Link href={`/homes/${booking.homeId}`} className="hover:text-gray-700">
                {booking.home.title}
              </Link>
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{booking.home.city}, {booking.home.country}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">{formatPrice(booking.totalAmount)}</span>
              <span className="text-sm text-gray-600 ml-1">total</span>
            </div>

            {/* Show different info based on user role */}
            <div className="text-sm text-gray-600">
              {isHost ? (
                <span>Guest: {booking.guest.name}</span>
              ) : (
                <span>Host: {booking.host.name}</span>
              )}
            </div>
          </div>

          {/* Request Message */}
          {booking.requestMessage && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-700">
                <strong>Guest message:</strong> {booking.requestMessage}
              </p>
            </div>
          )}

          {/* Response Message */}
          {booking.responseMessage && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-700">
                <strong>Host response:</strong> {booking.responseMessage}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-2">
          {isHost && booking.status === "pending" && (
            <BookingActions bookingId={booking.id} />
          )}
          
          <Link href={`/bookings/${booking.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}