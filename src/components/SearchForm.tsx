"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Search } from "lucide-react"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")
  const [guests, setGuests] = useState(searchParams.get("guests") || "2")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    if (guests) params.set("guests", guests)
    
    router.push(`/search?${params.toString()}`)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Where do you want to stay?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <Input
            id="startDate"
            type="date"
            min={today}
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} guest{num !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full mt-4 bg-red-500 hover:bg-red-600">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  )
}