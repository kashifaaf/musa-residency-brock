"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { createBooking } from "@/actions/bookings"
import { formatCurrency, calculateNights } from "@/lib/utils"
import type { Home } from "@/types"

interface BookingFormProps {
  home: Home
}

export function BookingForm({ home }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState("")

  const pricePerNight = parseFloat(home.pricePerNight)
  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0
  const totalPrice = nights * pricePerNight

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("homeId", home.id)
    formData.append("checkIn", checkIn)
    formData.append("checkOut", checkOut)
    formData.append("guests", guests.toString())
    formData.append("message", message)

    const result = await createBooking(formData)
    
    if (result.success) {
      router.push("/bookings")
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
      <div className="mb-6">
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(pricePerNight)} <span className="text-lg font-normal">/ night</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
              Check In
            </label>
            <input
              type="date"
              id="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
              Check Out
            </label>
            <input
              type="date"
              id="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Guests
            </label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              {Array.from({ length: home.maxGuests }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message to Host
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Tell the host about your creative project, why you'd like to stay here..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>

        {nights > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(pricePerNight)} × {nights} nights</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !checkIn || !checkOut}
          className="w-full"
        >
          {isLoading ? "Requesting..." : "Request to Book"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your booking request will be sent to the host for approval. You'll be charged only after approval.
        </p>
      </form>
    </div>
  )
}