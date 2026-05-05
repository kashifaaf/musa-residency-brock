import Link from "next/link"
import Image from "next/image"
import { Booking, Home, User } from "@/lib/db/schema"
import { formatCurrency, formatDateRange } from "@/lib/utils"
import { Calendar, MapPin } from "lucide-react"

interface BookingCardProps {
  booking: Booking & {
    home: Home
    guest?: User
    host?: User
  }
  isHost?: boolean
}

export function BookingCard({ booking, isHost = false }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const otherUser = isHost ? booking.guest : booking.host

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={booking.home.images[0] || "/placeholder-home.jpg"}
            alt={booking.home.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/homes/${booking.home.id}`}
              className="font-semibold text-lg text-gray-900 hover:text-red-600"
            >
              {booking.home.title}
            </Link>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            {booking.home.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar size={16} className="mr-1" />
            {formatDateRange(booking.startDate, booking.endDate)}
          </div>
          
          {otherUser && (
            <div className="text-sm text-gray-600 mb-2">
              {isHost ? "Guest" : "Host"}: {otherUser.name}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(Number(booking.totalAmount))}
            </div>
            
            <Link
              href={`/bookings/${booking.id}`}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}