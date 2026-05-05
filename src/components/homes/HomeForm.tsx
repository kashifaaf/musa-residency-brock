"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { createHome } from "@/actions/homes"

export function HomeForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    const result = await createHome(formData)
    
    if (result.success) {
      router.push(`/homes/${result.data.id}`)
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="Creative loft in downtown..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          placeholder="City, Country"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          placeholder="Describe your space, what makes it special for creative work, local art scene, etc."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700">
            Price per Night ($) *
          </label>
          <input
            type="number"
            id="pricePerNight"
            name="pricePerNight"
            required
            min="1"
            step="0.01"
            placeholder="100"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
            Max Guests *
          </label>
          <input
            type="number"
            id="maxGuests"
            name="maxGuests"
            required
            min="1"
            placeholder="2"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
            Bedrooms *
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            required
            min="0"
            placeholder="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
            Bathrooms *
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            required
            min="0"
            step="0.5"
            placeholder="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
          Amenities
        </label>
        <textarea
          id="amenities"
          name="amenities"
          rows={3}
          placeholder="WiFi, Kitchen, Art supplies, Natural light, Quiet workspace..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        <p className="mt-2 text-sm text-gray-500">
          Upload multiple images to showcase your space. First image will be used as the main photo.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Listing"}
        </Button>
      </div>
    </form>
  )
}