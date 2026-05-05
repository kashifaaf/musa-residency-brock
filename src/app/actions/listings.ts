"use server"

import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { homes } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"

interface CreateListingData {
  title: string
  description: string
  address: string
  city: string
  country: string
  pricePerNight: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
}

export async function createListing(data: CreateListingData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" }
    }

    const db = getDb()
    
    const [listing] = await db.insert(homes).values({
      hostId: session.user.id,
      title: data.title,
      description: data.description,
      address: data.address,
      city: data.city,
      country: data.country,
      pricePerNight: data.pricePerNight,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      maxGuests: data.maxGuests,
      amenities: [],
      photos: [],
    }).returning({ id: homes.id })

    revalidatePath("/host")
    
    return { success: true, data: { id: listing.id } }
  } catch (error) {
    console.error("Error creating listing:", error)
    return { success: false, error: "Failed to create listing" }
  }
}