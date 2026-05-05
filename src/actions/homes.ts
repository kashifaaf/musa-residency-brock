"use server"

import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { homes } from "@/db/schema"
import type { ActionResult } from "@/types"

export async function createHome(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const pricePerNight = formData.get("pricePerNight") as string
    const maxGuests = parseInt(formData.get("maxGuests") as string)
    const bedrooms = parseInt(formData.get("bedrooms") as string)
    const bathrooms = parseFloat(formData.get("bathrooms") as string)
    const amenities = formData.get("amenities") as string

    // Basic validation
    if (!title || !location || !description || !pricePerNight) {
      return { success: false, error: "Required fields missing" }
    }

    if (isNaN(maxGuests) || isNaN(bedrooms) || isNaN(bathrooms)) {
      return { success: false, error: "Invalid numeric values" }
    }

    const price = parseFloat(pricePerNight)
    if (isNaN(price) || price <= 0) {
      return { success: false, error: "Invalid price" }
    }

    // Handle file uploads (simplified - in production, upload to cloud storage)
    const files = formData.getAll("images") as File[]
    const imageUrls: string[] = []
    
    // For now, we'll use placeholder images since we don't have cloud storage set up
    // In production, you'd upload to S3, Cloudinary, etc.
    for (let i = 0; i < files.length && i < 5; i++) {
      const file = files[i]
      if (file.size > 0) {
        // Placeholder - replace with actual upload logic
        imageUrls.push(`/placeholder-home.jpg`)
      }
    }

    const db = getDb()
    
    const [newHome] = await db
      .insert(homes)
      .values({
        userId: session.user.id,
        title,
        location,
        description,
        pricePerNight: price.toString(),
        maxGuests,
        bedrooms,
        bathrooms,
        amenities: amenities || null,
        images: imageUrls.length > 0 ? imageUrls : null,
      })
      .returning({ id: homes.id })

    return { success: true, data: { id: newHome.id } }
  } catch (error) {
    console.error("Home creation error:", error)
    return { success: false, error: "Failed to create home listing" }
  }
}