"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function SearchForm({
  defaultValues,
  variant = "hero",
}: {
  defaultValues?: { city?: string; checkIn?: string; checkOut?: string; guests?: string }
  variant?: "hero" | "inline"
}) {
  const router = useRouter()
  const [city, setCity] = useState(defaultValues?.city || "")
  const [checkIn, setCheckIn] = useState(defaultValues?.checkIn || "")
  const [checkOut, setCheckOut] = useState(defaultValues?.checkOut || "")
  const [guests, setGuests] = useState(defaultValues?.guests || "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (guests) params.set("guests", guests)
    router.push(`/search?${params.toString()}`)
  }

  const isHero = variant === "hero"

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg",
        isHero ? "md:flex-row md:items-end md:gap-2" : "md:flex-row md:items-end md:gap-2"
      )}
    >
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          <MapPin className="mr-1 inline h-3 w-3" />Location
        </label>
        <input
          type="text"
          placeholder="City or country"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          <CalendarDays className="mr-1 inline h-3 w-3" />Check-in
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          <CalendarDays className="mr-1 inline h-3 w-3" />Check-out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="w-full md:w-24">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          <Users className="mr-1 inline h-3 w-3" />Guests
        </label>
        <input
          type="number"
          min="1"
          max="16"
          placeholder="2"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  )
}