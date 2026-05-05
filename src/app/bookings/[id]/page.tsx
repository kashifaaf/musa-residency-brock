import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { bookings, homes, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { formatCurrency, formatDateRange, calculateNights } from "@/lib/utils"
import { BookingActions } from "@/components/BookingActions"
import { MapPin, Calendar, Users, DollarSign } from "lucide-react"
import Image from "next/image"

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const bookingResult = await db
    .select({
      booking: bookings,
      home: homes,
      guest: users,
      host: users,
    })
    .from(bookings)
    .leftJoin(homes, eq(bookings.homeId, homes.id))
    .leftJoin(users, eq(bookings.guestId, users.id))
    .leftJoin(users, eq(bookings.hostId, users.id))
    .where(eq(bookings.id, id))
    .limit(1)

  if (!bookingResult.length) {
    notFound()
  }

  const { booking, home, guest, host } = bookingResult[0]

  if (!home || !guest || !host) {
    notFound()
  }

  // Check if user has access to this booking
  const isGuest = booking.guestId === session.user.id
  const isHost = booking.hostId === session.user.id

  if (!isGuest && !isHost) {
    notFound()
  }

  const nights = calculateNights(booking.startDate, booking.endDate)
  const otherUser = isGuest ? host : guest

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isGuest ? "Your Booking" : "Booking Request"}
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  Requested on {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {isHost && booking.status === "pending" && (
              <BookingActions bookingId={booking.id} />
            )}
          </div>
        </div>

        {/* Home Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-6">
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={home.images[0] || "/placeholder-home.jpg"}
                alt={home.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{home.title}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                {home.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-1" />
                Up to {home.maxGuests} guests
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">Dates</div>
                <div className="text-gray-600">{formatDateRange(booking.startDate, booking.endDate)}</div>
                <div className="text-sm text-gray-500">{nights} nights</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign size={20} className="text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">Total Amount</div>
                <div className="text-gray-600">{formatCurrency(Number(booking.totalAmount))}</div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(Number(home.pricePerNight))} × {nights} nights
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* People */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isGuest ? "Host" : "Guest"}
          </h3>
          
          <div className="flex items-center space-x-4">
            {otherUser.image ? (
              <img
                src={otherUser.image}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Users size={24} />
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900">{otherUser.name}</div>
              <div className="text-gray-600">{otherUser.email}</div>
              {otherUser.location && (
                <div className="text-sm text-gray-500">{otherUser.location}</div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
          
          <div className="space-y-4">
            {booking.requestMessage && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Initial request from {guest.name}:
                </div>
                <div className="text-gray-700">{booking.requestMessage}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(booking.createdAt).toLocaleString()}
                </div>
              </div>
            )}
            
            {booking.responseMessage && booking.respondedAt && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Response from {host.name}:
                </div>
                <div className="text-gray-700">{booking.responseMessage}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(booking.respondedAt).toLocaleString()}
                </div>
              </div>
            )}
            
            {booking.status === "pending" && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  {isHost 
                    ? "Please respond to this booking request within 24 hours."
                    : "Waiting for host response. The host has 24 hours to respond to your request."
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}