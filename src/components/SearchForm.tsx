"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/Button"

export function SearchForm() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (location) params.set("location", location)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (guests) params.set("guests", guests)

    router.push(`/homes?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where are you going?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
            Check In
          </label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
            Check Out
          </label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="1"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <Button type="submit" className="w-full md:w-auto">
          Search
        </Button>
      </div>
    </form>
  )
}