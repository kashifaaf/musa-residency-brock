"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    creativeSpace: searchParams.get("creativeSpace") === "true",
    amenities: searchParams.get("amenities")?.split(",") || [],
  })

  const amenitiesList = [
    "WiFi", "Kitchen", "Washing Machine", "Air Conditioning", 
    "Heating", "Parking", "Garden", "Balcony"
  ]

  const creativeAmenitiesList = [
    "Art Studio", "Natural Light", "Easel", "Drawing Table", 
    "Photography Setup", "Music Room", "Writing Desk", "Pottery Wheel"
  ]

  const updateURL = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Keep existing search params
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "amenities") {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","))
        } else {
          params.delete(key)
        }
      } else if (key === "creativeSpace") {
        if (value) {
          params.set(key, "true")
        } else {
          params.delete(key)
        }
      } else if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Price per night</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Rooms */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Bedrooms</h3>
          <select
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Bathrooms</h3>
          <select
            value={filters.bathrooms}
            onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        {/* Creative Space */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.creativeSpace}
              onChange={(e) => handleFilterChange("creativeSpace", e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Creative Space Available
            </span>
          </label>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
          <div className="space-y-2">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Creative Amenities */}
        {filters.creativeSpace && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Creative Amenities</h3>
            <div className="space-y-2">
              {creativeAmenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={updateURL}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}