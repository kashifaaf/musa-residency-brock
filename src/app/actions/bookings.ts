"use server"

import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { bookings, homes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"

interface CreateBookingData {
  homeId: string
  checkIn: string
  checkOut: string
  guests: number
  message?: string
  totalAmount: number
}

export async function createBookingRequest(data: CreateBookingData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" }
    }

    const db = getDb()
    
    // Get the home to find the hostId
    const [home] = await db.select({ hostId: homes.hostId })
      .from(homes)
      .where(eq(homes.id, data.homeId))
    
    if (!home) {
      return { success: false, error: "Home not found" }
    }
    
    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
    
    const [booking] = await db.insert(bookings).values({
      homeId: data.homeId,
      guestId: session.user.id,
      hostId: home.hostId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      totalAmount: data.totalAmount,
      requestMessage: data.message,
      expiresAt,
    }).returning({ id: bookings.id })

    revalidatePath("/bookings")
    
    return { success: true, data: { id: booking.id } }
  } catch (error) {
    console.error("Error creating booking request:", error)
    return { success: false, error: "Failed to create booking request" }
  }
}

export async function approveBooking(bookingId: string): Promise<ActionResult<void>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" }
    }

    const db = getDb()
    
    // TODO: Verify that the current user is the host of this booking
    // TODO: Create Stripe payment intent
    
    await db.update(bookings)
      .set({
        status: "approved",
        respondedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))

    revalidatePath("/bookings")
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error approving booking:", error)
    return { success: false, error: "Failed to approve booking" }
  }
}

export async function declineBooking(bookingId: string, message?: string): Promise<ActionResult<void>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" }
    }

    const db = getDb()
    
    await db.update(bookings)
      .set({
        status: "declined",
        responseMessage: message,
        respondedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))

    revalidatePath("/bookings")
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error declining booking:", error)
    return { success: false, error: "Failed to decline booking" }
  }
}