"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  publishListing,
  unpublishListing,
  addListingPhoto,
  removeListingPhoto,
  setAvailability,
  removeAvailability,
} from "@/actions/listings"
import { formatDate } from "@/lib/utils"
import { Trash2, Upload, Eye, EyeOff, CalendarPlus } from "lucide-react"
import type { Listing, ListingPhoto, Availability } from "@/types"

type ListingWithExtras = Listing & { photos: ListingPhoto[]; availability: Availability[] }

export function ListingEditSidebar({ listing }: { listing: ListingWithExtras }) {
  const router = useRouter()
  const [photoUrl, setPhotoUrl] = useState("")
  const [photoCaption, setPhotoCaption] = useState("")
  const [addingPhoto, setAddingPhoto] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [addingAvail, setAddingAvail] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")

  async function handleAddPhoto() {
    if (!photoUrl.trim()) return
    setAddingPhoto(true)
    setError("")
    const result = await addListingPhoto(listing.id, photoUrl.trim(), photoCaption.trim() || undefined)
    if (result.success) {
      setPhotoUrl("")
      setPhotoCaption("")
      router.refresh()
    } else {
      setError(result.error)
    }
    setAddingPhoto(false)
  }

  async function handleRemovePhoto(photoId: string) {
    const result = await removeListingPhoto(photoId)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  async function handleAddAvailability() {
    if (!startDate || !endDate) return
    setAddingAvail(true)
    setError("")
    const result = await setAvailability(listing.id, new Date(startDate), new Date(endDate))
    if (result.success) {
      setStartDate("")
      setEndDate("")
      router.refresh()
    } else {
      setError(result.error)
    }
    setAddingAvail(false)
  }

  async function handleRemoveAvailability(availId: string) {
    const result = await removeAvailability(availId)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  async function handleTogglePublish() {
    setPublishing(true)
    setError("")
    const result = listing.isPublished
      ? await unpublishListing(listing.id)
      : await publishListing(listing.id)
    if (!result.success) {
      setError(result.error)
    }
    router.refresh()
    setPublishing(false)
  }

  const sortedPhotos = [...listing.photos].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="space-y-6">
      {/* Publish / Unpublish */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Status: {listing.isPublished ? "Published" : "Draft"}
          </span>
          <button
            onClick={handleTogglePublish}
            disabled={publishing}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              listing.isPublished
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            } disabled:opacity-50`}
          >
            {listing.isPublished ? (
              <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
            ) : (
              <><Eye className="h-3.5 w-3.5" /> Publish</>
            )}
          </button>
        </div>
      </div>

      {/* Photos */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">Photos ({listing.photos.length})</h3>
        {sortedPhotos.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {sortedPhotos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                <img src={photo.url} alt={photo.caption || ""} className="h-full w-full object-cover" />
                <button
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-1 right-1 rounded-full bg-destructive/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 space-y-2">
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Photo URL"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            value={photoCaption}
            onChange={(e) => setPhotoCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleAddPhoto}
            disabled={!photoUrl.trim() || addingPhoto}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            {addingPhoto ? "Adding..." : "Add Photo"}
          </button>
        </div>
      </div>

      {/* Availability */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">Availability</h3>
        {listing.availability.length > 0 && (
          <div className="mt-3 space-y-2">
            {listing.availability.map((avail) => (
              <div key={avail.id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
                <span>{formatDate(avail.startDate)} — {formatDate(avail.endDate)}</span>
                <button
                  onClick={() => handleRemoveAvailability(avail.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={handleAddAvailability}
            disabled={!startDate || !endDate || addingAvail}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            {addingAvail ? "Adding..." : "Add Availability"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}