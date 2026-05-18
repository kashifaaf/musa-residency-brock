"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { listings, listingPhotos, availability } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

const listingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  location: z.string().min(2),
  city: z.string().min(1),
  country: z.string().min(1),
  pricePerNight: z.number().int().positive(),
  maxGuests: z.number().int().min(1).max(16),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  amenities: z.array(z.string()).optional(),
  creativeAmenities: z.array(z.string()).optional(),
  houseRules: z.string().optional(),
  minStayNights: z.number().int().min(1).optional(),
})

export async function createListing(formData: z.infer<typeof listingSchema>): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to create a listing" }
    }

    const parsed = listingSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const [listing] = await db
      .insert(listings)
      .values({
        hostId: session.user.id,
        ...parsed.data,
        amenities: parsed.data.amenities || [],
        creativeAmenities: parsed.data.creativeAmenities || [],
        minStayNights: parsed.data.minStayNights || 30,
        isPublished: false,
      })
      .returning({ id: listings.id })

    revalidatePath("/dashboard")
    return { success: true, data: { id: listing.id } }
  } catch (error) {
    console.error("createListing error:", error)
    return { success: false, error: "Failed to create listing" }
  }
}

export async function updateListing(
  listingId: string,
  formData: Partial<z.infer<typeof listingSchema>>
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
    })
    if (!existing) {
      return { success: false, error: "Listing not found or unauthorized" }
    }

    await db
      .update(listings)
      .set({ ...formData, updatedAt: new Date() })
      .where(eq(listings.id, listingId))

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/dashboard")
    return { success: true, data: { id: listingId } }
  } catch (error) {
    console.error("updateListing error:", error)
    return { success: false, error: "Failed to update listing" }
  }
}

export async function publishListing(listingId: string): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
      with: { photos: true },
    })

    if (!existing) {
      return { success: false, error: "Listing not found or unauthorized" }
    }

    if (existing.photos.length === 0) {
      return { success: false, error: "Add at least one photo before publishing" }
    }

    await db
      .update(listings)
      .set({ isPublished: true, updatedAt: new Date() })
      .where(eq(listings.id, listingId))

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/search")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true, data: null }
  } catch (error) {
    console.error("publishListing error:", error)
    return { success: false, error: "Failed to publish listing" }
  }
}

export async function unpublishListing(listingId: string): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    await db
      .update(listings)
      .set({ isPublished: false, updatedAt: new Date() })
      .where(and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)))

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/search")
    revalidatePath("/dashboard")
    return { success: true, data: null }
  } catch (error) {
    console.error("unpublishListing error:", error)
    return { success: false, error: "Failed to unpublish listing" }
  }
}

export async function addListingPhoto(
  listingId: string,
  url: string,
  caption?: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
      with: { photos: true },
    })
    if (!existing) {
      return { success: false, error: "Listing not found or unauthorized" }
    }

    const sortOrder = existing.photos.length

    const [photo] = await db
      .insert(listingPhotos)
      .values({ listingId, url, caption: caption || null, sortOrder })
      .returning({ id: listingPhotos.id })

    revalidatePath(`/listings/${listingId}`)
    revalidatePath(`/listings/${listingId}/edit`)
    return { success: true, data: { id: photo.id } }
  } catch (error) {
    console.error("addListingPhoto error:", error)
    return { success: false, error: "Failed to add photo" }
  }
}

export async function removeListingPhoto(photoId: string): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const photo = await db.query.listingPhotos.findFirst({
      where: eq(listingPhotos.id, photoId),
      with: { listing: true },
    })

    if (!photo || photo.listing.hostId !== session.user.id) {
      return { success: false, error: "Photo not found or unauthorized" }
    }

    await db.delete(listingPhotos).where(eq(listingPhotos.id, photoId))

    revalidatePath(`/listings/${photo.listingId}`)
    revalidatePath(`/listings/${photo.listingId}/edit`)
    return { success: true, data: null }
  } catch (error) {
    console.error("removeListingPhoto error:", error)
    return { success: false, error: "Failed to remove photo" }
  }
}

export async function setAvailability(
  listingId: string,
  startDate: Date,
  endDate: Date
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
    })
    if (!existing) {
      return { success: false, error: "Listing not found or unauthorized" }
    }

    if (startDate >= endDate) {
      return { success: false, error: "Start date must be before end date" }
    }

    const [avail] = await db
      .insert(availability)
      .values({ listingId, startDate, endDate, isAvailable: true })
      .returning({ id: availability.id })

    revalidatePath(`/listings/${listingId}`)
    revalidatePath(`/listings/${listingId}/edit`)
    return { success: true, data: { id: avail.id } }
  } catch (error) {
    console.error("setAvailability error:", error)
    return { success: false, error: "Failed to set availability" }
  }
}

export async function removeAvailability(availabilityId: string): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const avail = await db.query.availability.findFirst({
      where: eq(availability.id, availabilityId),
      with: { listing: true },
    })

    if (!avail || avail.listing.hostId !== session.user.id) {
      return { success: false, error: "Availability not found or unauthorized" }
    }

    await db.delete(availability).where(eq(availability.id, availabilityId))

    revalidatePath(`/listings/${avail.listingId}`)
    revalidatePath(`/listings/${avail.listingId}/edit`)
    return { success: true, data: null }
  } catch (error) {
    console.error("removeAvailability error:", error)
    return { success: false, error: "Failed to remove availability" }
  }
}