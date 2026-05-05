"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import type { SearchFilters } from "@/lib/types"

interface SearchFiltersProps {
  initialFilters: SearchFilters
}

export function SearchFilters({ initialFilters }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  function handleFilterChange(key: keyof SearchFilters, value: string | number | undefined) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })
    
    router.push(`/search?${params.toString()}`)
  }

  function clearFilters() {
    setFilters({})
    router.push("/search")
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="City, country..."
            value={filters.location || ""}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="checkIn">Check-in</Label>
          <Input
            id="checkIn"
            type="date"
            value={filters.checkIn || ""}
            onChange={(e) => handleFilterChange("checkIn", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="checkOut">Check-out</Label>
          <Input
            id="checkOut"
            type="date"
            value={filters.checkOut || ""}
            onChange={(e) => handleFilterChange("checkOut", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            placeholder="1"
            value={filters.guests || ""}
            onChange={(e) => handleFilterChange("guests", e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
        
        <div>
          <Label>Price Range (per night)</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-4">
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}