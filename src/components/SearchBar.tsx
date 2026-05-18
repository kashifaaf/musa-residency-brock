"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (guests) params.set("guests", guests)
    router.push(`/search?${params.toString()}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-2xl">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Where to?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 p-2.5 text-white hover:bg-primary-700 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="City or country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            placeholder="Check in"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            placeholder="Check out"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative">
          <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            min={1}
            max={20}
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="sm:hidden lg:block">Search</span>
        </button>
      </div>
    </form>
  )
}