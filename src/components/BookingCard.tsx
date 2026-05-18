"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CalendarDays, Users } from "lucide-react"
import { formatCurrency, calculateNights } from "@/lib/utils"
import toast from "react-hot-toast"
import type { Listing } from "@/types"

export function BookingCard({ listing }: { listing: Listing }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const nights =
    checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0
  const totalPrice = nights * Number(listing.pricePerNight)

  async function handleBookingRequest() {
    if (!session) {
      router.push("/login")
      return
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates")
      return
    }
    if (nights < (listing.minimumStay || 1)) {
      toast.error(`Minimum stay is ${listing.minimumStay} night${(listing.minimumStay || 1) > 1 ? "s" : ""}`)
      return
    }
    if (nights > (listing.maximumStay || 365)) {
      toast.error(`Maximum stay is ${listing.maximumStay} nights`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          checkIn,
          checkOut,
          guests,
          message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Booking request sent! The host has 24 hours to respond.")
        router.push(`/bookings/${data.data.id}`)
      } else {
        toast.error(data.error || "Failed to submit booking request")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isOwnListing = session?.user?.id === listing.hostId

  return (
    <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-4">
        <span className="text-2xl font-bold text-gray-900">
          {formatCurrency(Number(listing.pricePerNight), listing.currency || "USD")}
        </span>
        <span className="text-gray-500"> / night</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">CHECK-IN</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">CHECK-OUT</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">GUESTS</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full appearance-none rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {Array.from({ length: listing.maxGuests || 2 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} guest{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">MESSAGE TO HOST (OPTIONAL)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself and tell the host about your trip..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {formatCurrency(Number(listing.pricePerNight), listing.currency || "USD")} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span className="font-medium">{formatCurrency(totalPrice, listing.currency || "USD")}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2">
            <span>Total</span>
            <span>{formatCurrency(totalPrice, listing.currency || "USD")}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleBookingRequest}
        disabled={loading || isOwnListing || !checkIn || !checkOut || nights <= 0}
        className="mt-4 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {loading
          ? "Submitting..."
          : isOwnListing
            ? "You own this listing"
            : "Request to Book"}
      </button>

      {!isOwnListing && (
        <p className="mt-2 text-center text-xs text-gray-400">
          You won&apos;t be charged yet. The host has 24 hours to respond.
        </p>
      )}
    </div>
  )
}