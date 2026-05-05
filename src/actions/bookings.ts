"use server"

import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { bookings, homes } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ActionResult } from "@/types"

export async function createBooking(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const homeId = formData.get("homeId") as string
    const checkIn = formData.get("checkIn") as string
    const checkOut = formData.get("checkOut") as string
    const guests = parseInt(formData.get("guests") as string)
    const message = formData.get("message") as string

    // Validation
    if (!homeId || !checkIn || !checkOut || isNaN(guests)) {
      return { success: false, error: "Required fields missing" }
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return { success: false, error: "Check-in date cannot be in the past" }
    }

    if (checkOutDate <= checkInDate) {
      return { success: false, error: "Check-out must be after check-in" }
    }

    // Get minimum stay requirement (30+ days as per PRD)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    if (nights < 30) {
      return { success: false, error: "Minimum stay is 30 nights" }
    }

    const db = getDb()

    // Get home details and verify it exists
    const [home] = await db
      .select()
      .from(homes)
      .where(eq(homes.id, homeId))
      .limit(1)

    if (!home) {
      return { success: false, error: "Home not found" }
    }

    if (home.userId === session.user.id) {
      return { success: false, error: "Cannot book your own home" }
    }

    if (guests > home.maxGuests) {
      return { success: false, error: "Too many guests for this home" }
    }

    // Calculate total price
    const pricePerNight = parseFloat(home.pricePerNight)
    const totalPrice = nights * pricePerNight

    // Set response deadline (24 hours)
    const responseDeadline = new Date()
    responseDeadline.setHours(responseDeadline.getHours() + 24)

    const [newBooking] = await db
      .insert(bookings)
      .values({
        homeId,
        guestId: session.user.id,
        hostId: home.userId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice: totalPrice.toString(),
        message: message || null,
        responseDeadline,
        status: "pending",
      })
      .returning({ id: bookings.id })

    // TODO: Send email notification to host

    return { success: true, data: { id: newBooking.id } }
  } catch (error) {
    console.error("Booking creation error:", error)
    return { success: false, error: "Failed to create booking request" }
  }
}

export async function approveBooking(bookingId: string): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const db = getDb()

    // Verify user is the host of this booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.hostId !== session.user.id) {
      return { success: false, error: "Not authorized" }
    }

    if (booking.status !== "pending") {
      return { success: false, error: "Booking is not pending" }
    }

    // Check if response deadline has passed
    if (new Date() > booking.responseDeadline) {
      // Auto-decline expired bookings
      await db
        .update(bookings)
        .set({ status: "declined", updatedAt: new Date() })
        .where(eq(bookings.id, bookingId))
      
      return { success: false, error: "Booking request has expired" }
    }

    await db
      .update(bookings)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(bookings.id, bookingId))

    // TODO: Send email notification to guest
    // TODO: Create Stripe payment intent

    return { success: true, data: { success: true } }
  } catch (error) {
    console.error("Booking approval error:", error)
    return { success: false, error: "Failed to approve booking" }
  }
}

export async function declineBooking(bookingId: string): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const db = getDb()

    // Verify user is the host of this booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.hostId !== session.user.id) {
      return { success: false, error: "Not authorized" }
    }

    if (booking.status !== "pending") {
      return { success: false, error: "Booking is not pending" }
    }

    await db
      .update(bookings)
      .set({ status: "declined", updatedAt: new Date() })
      .where(eq(bookings.id, bookingId))

    // TODO: Send email notification to guest

    return { success: true, data: { success: true } }
  } catch (error) {
    console.error("Booking decline error:", error)
    return { success: false, error: "Failed to decline booking" }
  }
}