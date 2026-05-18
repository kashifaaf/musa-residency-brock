"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBookingRequest } from "@/actions/bookings"
import { calculateTotalPrice, formatCurrency } from "@/lib/utils"

export function BookingRequestForm({
  listingId,
  pricePerNight,
  minStayNights,
}: {
  listingId: string
  pricePerNight: number
  minStayNights: number
}) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const totalPrice =
    checkIn && checkOut
      ? calculateTotalPrice(pricePerNight, new Date(checkIn), new Date(checkOut))
      : 0
  const nights =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }

    if (nights < minStayNights) {
      setError(`Minimum stay is ${minStayNights} nights`)
      return
    }

    setLoading(true)
    try {
      const result = await createBookingRequest({
        listingId,
        checkIn,
        checkOut,
        guestMessage: message || undefined,
      })

      if (result.success) {
        router.push(`/bookings/${result.data.bookingId}`)
      } else {
        setError(result.error)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Message to host (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the host about yourself and your trip..."
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {nights > 0 && totalPrice > 0 && (
        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{formatCurrency(pricePerNight * 100)} × {nights} nights</span>
            <span>{formatCurrency(totalPrice * 100)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span>{formatCurrency(totalPrice * 100)}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Submitting..." : "Request to Book"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Your payment will be authorized but not charged until the host approves.
      </p>
    </form>
  )
}