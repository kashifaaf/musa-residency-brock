"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Search } from "lucide-react"

export function SearchForm() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (guests) params.set("guests", guests)
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Input
          type="text"
          placeholder="Where to?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="date"
          placeholder="Check in"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      
      <div>
        <Input
          type="date"
          placeholder="Check out"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="Guests"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
        <Button type="submit" className="px-4">
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}