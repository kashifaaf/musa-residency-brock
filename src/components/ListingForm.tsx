"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createListing, updateListing } from "@/actions/listings"
import type { Listing } from "@/types"

const COMMON_AMENITIES = [
  "WiFi", "Kitchen", "Washer", "Dryer", "Air Conditioning", "Heating",
  "TV", "Workspace", "Parking", "Gym", "Pool", "Garden",
]

const CREATIVE_AMENITIES = [
  "Art Studio", "Music Room", "Writing Desk", "Natural Light",
  "Darkroom", "Recording Equipment", "Library", "Gallery Wall",
  "Workshop Space", "Piano", "Photography Studio", "Printing Press",
]

export function ListingForm({ existing }: { existing?: Listing }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState(existing?.title || "")
  const [description, setDescription] = useState(existing?.description || "")
  const [location, setLocation] = useState(existing?.location || "")
  const [city, setCity] = useState(existing?.city || "")
  const [country, setCountry] = useState(existing?.country || "")
  const [pricePerNight, setPricePerNight] = useState(existing?.pricePerNight?.toString() || "")
  const [maxGuests, setMaxGuests] = useState(existing?.maxGuests?.toString() || "2")
  const [bedrooms, setBedrooms] = useState(existing?.bedrooms?.toString() || "1")
  const [bathrooms, setBathrooms] = useState(existing?.bathrooms?.toString() || "1")
  const [minStayNights, setMinStayNights] = useState(existing?.minStayNights?.toString() || "30")
  const [houseRules, setHouseRules] = useState(existing?.houseRules || "")
  const [amenities, setAmenities] = useState<string[]>((existing?.amenities as string[]) || [])
  const [creativeAmenities, setCreativeAmenities] = useState<string[]>((existing?.creativeAmenities as string[]) || [])

  function toggleAmenity(amenity: string, isCreative: boolean) {
    if (isCreative) {
      setCreativeAmenities((prev) =>
        prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
      )
    } else {
      setAmenities((prev) =>
        prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
      )
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const data = {
      title,
      description,
      location,
      city,
      country,
      pricePerNight: parseInt(pricePerNight, 10),
      maxGuests: parseInt(maxGuests, 10),
      bedrooms: parseInt(bedrooms, 10),
      bathrooms: parseInt(bathrooms, 10),
      minStayNights: parseInt(minStayNights, 10),
      amenities,
      creativeAmenities,
      houseRules: houseRules || undefined,
    }

    try {
      const result = existing
        ? await updateListing(existing.id, data)
        : await createListing(data)

      if (result.success) {
        router.push(`/listings/${result.data.id}/edit`)
      } else {
        setError(result.error)
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunny loft in the heart of Lisbon"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your space, the neighborhood, and what makes it special..."
            rows={6}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            required
          />
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Location</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Full Address / Area</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Alfama, Lisbon"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lisbon"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Portugal"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Details</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Price / Night ($)</label>
            <input
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              min="1"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Max Guests</label>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
              max="16"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Bedrooms</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              min="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Bathrooms</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              min="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Min Stay (nights)</label>
          <input
            type="number"
            value={minStayNights}
            onChange={(e) => setMinStayNights(e.target.value)}
            min="1"
            className="w-full max-w-[200px] rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </section>

      {/* Amenities */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">General</h3>
          <div className="flex flex-wrap gap-2">
            {COMMON_AMENITIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a, false)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  amenities.includes(a)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-foreground hover:border-accent/50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Creative Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {CREATIVE_AMENITIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a, true)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  creativeAmenities.includes(a)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-foreground hover:border-accent/50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* House Rules */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">House Rules</h2>
        <textarea
          value={houseRules}
          onChange={(e) => setHouseRules(e.target.value)}
          placeholder="No smoking, quiet hours after 10pm..."
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Saving..." : existing ? "Update Listing" : "Create Listing"}
      </button>
    </form>
  )
}