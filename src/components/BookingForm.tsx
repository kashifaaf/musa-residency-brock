"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { formatPrice } from "@/lib/utils"
import { createBookingRequest } from "@/app/actions/bookings"
import type { HomeWithHost } from "@/lib/types"

interface BookingFormProps {
  home: HomeWithHost
}

export function BookingForm({ home }: BookingFormProps) {
  const { data: session } = useSession()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  function calculateTotalAmount(): number {
    if (!checkIn || !checkOut) return 0
    
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return nights > 0 ? nights * home.pricePerNight : 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!session) {
      setError("You must be signed in to make a booking request")
      return
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out date must be after check-in date")
      return
    }

    if (guests > home.maxGuests) {
      setError(`Maximum ${home.maxGuests} guests allowed`)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const result = await createBookingRequest({
        homeId: home.id,
        checkIn,
        checkOut,
        guests,
        message,
        totalAmount: calculateTotalAmount(),
      })

      if (result.success) {
        // Redirect to booking confirmation or show success message
        window.location.href = `/bookings/${result.data.id}`
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = calculateTotalAmount()
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
      <div className="mb-4">
        <span className="text-2xl font-bold">{formatPrice(home.pricePerNight)}</span>
        <span className="text-gray-600"> / night</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn">Check-in</Label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label htmlFor="checkOut">Check-out</Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max={home.maxGuests}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Message to Host (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Tell the host about yourself and your planned visit..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {totalAmount > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{formatPrice(home.pricePerNight)} × {nights} nights</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !session}
        >
          {isSubmitting ? "Submitting..." : "Request to Book"}
        </Button>

        {!session && (
          <p className="text-sm text-gray-600 text-center">
            You must sign in to make a booking request
          </p>
        )}
      </form>
    </div>
  )
}