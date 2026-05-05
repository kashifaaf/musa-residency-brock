"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function SearchForm() {
  const [location, setLocation] = useState("")
  const [checkin, setCheckin] = useState("")
  const [checkout, setCheckout] = useState("")
  const [guests, setGuests] = useState(2)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (checkin) params.set("checkin", checkin)
    if (checkout) params.set("checkout", checkout)
    params.set("guests", guests.toString())
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Where to?
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <input
            type="date"
            id="checkin"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <input
            type="date"
            id="checkout"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} guest{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="bg-orange-600 text-white px-8 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
        >
          Search Creative Spaces
        </button>
      </div>
    </form>
  )
}