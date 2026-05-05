"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Home, Availability } from "@/lib/db/schema"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { formatCurrency, calculateNights } from "@/lib/utils"
import { createBookingRequest } from "@/app/actions/booking"

interface BookingRequestFormProps {
  home: Home
  availabilityPeriods: Availability[]
}

export function BookingRequestForm({ home, availabilityPeriods }: BookingRequestFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const nights = startDate && endDate ? calculateNights(startDate, endDate) : 0
  const totalAmount = nights * Number(home.pricePerNight)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    if (!startDate || !endDate) {
      setError("Please select check-in and check-out dates")
      return
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Check-out date must be after check-in date")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await createBookingRequest({
        homeId: home.id,
        startDate,
        endDate,
        message: message || undefined,
      })
      
      if (result.success) {
        router.push(`/bookings/${result.data.id}`)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get min and max dates from availability
  const today = new Date().toISOString().split("T")[0]
  const minDate = availabilityPeriods.length > 0 
    ? Math.max(new Date(availabilityPeriods[0].startDate).getTime(), new Date().getTime())
    : new Date().getTime()
  
  const maxDate = availabilityPeriods.length > 0
    ? Math.max(...availabilityPeriods.map(p => new Date(p.endDate).getTime()))
    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).getTime() // 90 days from now

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="mb-6">
        <div className="text-2xl font-semibold text-gray-900">
          {formatCurrency(Number(home.pricePerNight))}
          <span className="text-base font-normal text-gray-600"> per night</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <Input
              id="startDate"
              type="date"
              min={today}
              max={new Date(maxDate).toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <Input
              id="endDate"
              type="date"
              min={startDate || today}
              max={new Date(maxDate).toISOString().split("T")[0]}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message to host (optional)
          </label>
          <Textarea
            id="message"
            placeholder="Tell the host about yourself and why you'd like to stay..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        {nights > 0 && (
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(Number(home.pricePerNight))} × {nights} nights</span>
              <span>{formatCurrency(Number(home.pricePerNight) * nights)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600"
          disabled={isLoading || !session}
          size="lg"
        >
          {isLoading ? "Submitting..." : "Request to Book"}
        </Button>
        
        {!session && (
          <p className="text-sm text-gray-600 text-center">
            Please sign in to make a booking request
          </p>
        )}
      </form>
      
      {availabilityPeriods.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Available dates:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {availabilityPeriods.slice(0, 3).map((period, index) => (
              <div key={index}>
                {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
              </div>
            ))}
            {availabilityPeriods.length > 3 && (
              <div className="text-gray-500">+ {availabilityPeriods.length - 3} more periods</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}