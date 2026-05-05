"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency, formatDate, calculateNights } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { approveBooking, declineBooking } from "@/actions/bookings"
import type { Booking, Home, User } from "@/types"

interface BookingCardProps {
  booking: Booking
  home: Home | null
  host: User | null
  guest: User | null
  userRole: "host" | "guest"
}

export function BookingCard({ booking, home, host, guest, userRole }: BookingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const nights = calculateNights(booking.checkIn, booking.checkOut)
  const isPending = booking.status === "pending"
  const isHost = userRole === "host"

  const handleApprove = async () => {
    setIsLoading(true)
    setError("")

    const result = await approveBooking(booking.id)
    
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const handleDecline = async () => {
    setIsLoading(true)
    setError("")

    const result = await declineBooking(booking.id)
    
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "approved":
        return "text-green-600 bg-green-100"
      case "declined":
        return "text-red-600 bg-red-100"
      case "paid":
        return "text-blue-600 bg-blue-100"
      case "cancelled":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {home?.title || "Unknown Home"}
          </h3>
          <p className="text-gray-600">{home?.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Check In:</span>
          <div className="font-medium">{formatDate(booking.checkIn)}</div>
        </div>
        <div>
          <span className="text-gray-500">Check Out:</span>
          <div className="font-medium">{formatDate(booking.checkOut)}</div>
        </div>
        <div>
          <span className="text-gray-500">Guests:</span>
          <div className="font-medium">{booking.guests}</div>
        </div>
        <div>
          <span className="text-gray-500">Total:</span>
          <div className="font-medium">{formatCurrency(booking.totalPrice)}</div>
        </div>
      </div>

      {booking.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <span className="text-gray-500 text-sm">Message from guest:</span>
          <p className="text-gray-700 mt-1">{booking.message}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {(isHost ? guest : host)?.image && (
            <img
              src={(isHost ? guest : host)!.image!}
              alt={(isHost ? guest : host)?.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">
              {isHost ? "Request from " : "Hosted by "}
              {(isHost ? guest : host)?.name}
            </p>
            <p className="text-sm text-gray-500">
              {isHost ? guest?.email : host?.email}
            </p>
          </div>
        </div>

        {isHost && isPending && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              disabled={isLoading}
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Approve"}
            </Button>
          </div>
        )}

        {booking.status === "approved" && !isHost && (
          <Button size="sm">
            Complete Payment
          </Button>
        )}
      </div>

      {isPending && isHost && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-yellow-800 text-sm">
            Response deadline: {formatDate(booking.responseDeadline)}
          </p>
        </div>
      )}
    </div>
  )
}