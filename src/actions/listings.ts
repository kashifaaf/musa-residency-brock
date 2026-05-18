"use server"

import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { listings, listingPhotos, availability } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const listingSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1).max(255),
  state: z.string().optional(),
  country: z.string().min(1).max(255),
  postalCode: z.string().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().int().min(0).max(50).optional(),
  maxGuests: z.number().int().min(1).max(50).optional(),
  amenities: z.array(z.string()).optional(),
  creativeAmenities: z.array(z.string()).optional(),
  houseRules: z.string().optional(),
  pricePerNight: z.number().positive(),
  currency: z.string().length(3).optional(),
  minimumStay: z.number().int().min(1).optional(),
  maximumStay: z.number().int().min(1).optional(),
})

const photoSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  sortOrder: z.number().int().min(0),
})

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createListing(
  formData: z.infer<typeof listingSchema> & { photos?: z.infer<typeof photoSchema>[] }
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const parsed = listingSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid data" }
    }

    const data = parsed.data

    const [listing] = await db
      .insert(listings)
      .values({
        hostId: session.user.id,
        title: data.title,
        description: data.description || null,
        address: data.address || null,
        city: data.city,
        state: data.state || null,
        country: data.country,
        postalCode: data.postalCode || null,
        propertyType: data.propertyType || null,
        bedrooms: data.bedrooms ?? 1,
        bathrooms: data.bathrooms ?? 1,
        maxGuests: data.maxGuests ?? 2,
        amenities: data.amenities ? JSON.stringify(data.amenities) : null,
        creativeAmenities: data.creativeAmenities ? JSON.stringify(data.creativeAmenities) : null,
        houseRules: data.houseRules || null,
        pricePerNight: data.pricePerNight.toFixed(2),
        currency: data.currency || "USD",
        minimumStay: data.minimumStay ?? 1,
        maximumStay: data.maximumStay ?? 365,
        isPublished: false,
      })
      .returning({ id: listings.id })

    if (formData.photos?.length) {
      await db.insert(listingPhotos).values(
        formData.photos.map((p) => ({
          listingId: listing.id,
          url: p.url,
          caption: p.caption || null,
          sortOrder: p.sortOrder,
        }))
      )
    }

    revalidatePath("/dashboard")
    revalidatePath("/search")

    return { success: true, data: { id: listing.id } }
  } catch (error) {
    console.error("createListing error:", error)
    return { success: false, error: "Failed to create listing" }
  }
}

export async function updateListing(
  listingId: string,
  formData: Partial<z.infer<typeof listingSchema>> & { photos?: z.infer<typeof photoSchema>[] }
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
    })

    if (!existing) {
      return { success: false, error: "Listing not found or you don't have permission" }
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    if (formData.title !== undefined) updateData.title = formData.title
    if (formData.description !== undefined) updateData.description = formData.description
    if (formData.address !== undefined) updateData.address = formData.address
    if (formData.city !== undefined) updateData.city = formData.city
    if (formData.state !== undefined) updateData.state = formData.state
    if (formData.country !== undefined) updateData.country = formData.country
    if (formData.postalCode !== undefined) updateData.postalCode = formData.postalCode
    if (formData.propertyType !== undefined) updateData.propertyType = formData.propertyType
    if (formData.bedrooms !== undefined) updateData.bedrooms = formData.bedrooms
    if (formData.bathrooms !== undefined) updateData.bathrooms = formData.bathrooms
    if (formData.maxGuests !== undefined) updateData.maxGuests = formData.maxGuests
    if (formData.amenities !== undefined) updateData.amenities = JSON.stringify(formData.amenities)
    if (formData.creativeAmenities !== undefined)
      updateData.creativeAmenities = JSON.stringify(formData.creativeAmenities)
    if (formData.houseRules !== undefined) updateData.houseRules = formData.houseRules
    if (formData.pricePerNight !== undefined)
      updateData.pricePerNight = formData.pricePerNight.toFixed(2)
    if (formData.currency !== undefined) updateData.currency = formData.currency
    if (formData.minimumStay !== undefined) updateData.minimumStay = formData.minimumStay
    if (formData.maximumStay !== undefined) updateData.maximumStay = formData.maximumStay

    await db.update(listings).set(updateData).where(eq(listings.id, listingId))

    if (formData.photos) {
      await db.delete(listingPhotos).where(eq(listingPhotos.listingId, listingId))
      if (formData.photos.length > 0) {
        await db.insert(listingPhotos).values(
          formData.photos.map((p) => ({
            listingId,
            url: p.url,
            caption: p.caption || null,
            sortOrder: p.sortOrder,
          }))
        )
      }
    }

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/dashboard")
    revalidatePath("/search")

    return { success: true, data: { id: listingId } }
  } catch (error) {
    console.error("updateListing error:", error)
    return { success: false, error: "Failed to update listing" }
  }
}

export async function toggleListingPublished(
  listingId: string
): Promise<ActionResult<{ isPublished: boolean }>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
    })

    if (!existing) {
      return { success: false, error: "Listing not found" }
    }

    const newStatus = !existing.isPublished

    await db
      .update(listings)
      .set({ isPublished: newStatus, updatedAt: new Date() })
      .where(eq(listings.id, listingId))

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/dashboard")
    revalidatePath("/search")

    return { success: true, data: { isPublished: newStatus } }
  } catch (error) {
    console.error("toggleListingPublished error:", error)
    return { success: false, error: "Failed to update listing" }
  }
}

export async function deleteListing(listingId: string): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
    })

    if (!existing) {
      return { success: false, error: "Listing not found" }
    }

    await db.delete(listings).where(eq(listings.id, listingId))

    revalidatePath("/dashboard")
    revalidatePath("/search")

    return { success: true, data: null }
  } catch (error) {
    console.error("deleteListing error:", error)
    return { success: false, error: "Failed to delete listing" }
  }
}

export async function setAvailability(
  listingId: string,
  dates: { startDate: string; endDate: string; isAvailable: boolean }[]
): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const existing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.hostId, session.user.id)),
    })

    if (!existing) {
      return { success: false, error: "Listing not found" }
    }

    await db.delete(availability).where(eq(availability.listingId, listingId))

    if (dates.length > 0) {
      await db.insert(availability).values(
        dates.map((d) => ({
          listingId,
          startDate: new Date(d.startDate),
          endDate: new Date(d.endDate),
          isAvailable: d.isAvailable,
        }))
      )
    }

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/search")

    return { success: true, data: null }
  } catch (error) {
    console.error("setAvailability error:", error)
    return { success: false, error: "Failed to set availability" }
  }
}