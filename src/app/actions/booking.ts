"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, homes, users, availability } from "@/lib/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"
import { stripe } from "@/lib/stripe"
import { calculateNights } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import type { ActionResult, BookingRequest } from "@/types"

export async function createBookingRequest(
  request: BookingRequest
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to make a booking request" }
    }

    const { homeId, startDate, endDate, message } = request
    
    // Get home and host info
    const homeResult = await db
      .select({
        home: homes,
        host: users,
      })
      .from(homes)
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(and(eq(homes.id, homeId), eq(homes.isActive, true)))
      .limit(1)

    if (!homeResult.length || !homeResult[0].host) {
      return { success: false, error: "Home not found or inactive" }
    }

    const { home, host } = homeResult[0]

    // Check if user is trying to book their own home
    if (home.hostId === session.user.id) {
      return { success: false, error: "You cannot book your own home" }
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      return { success: false, error: "Check-in date cannot be in the past" }
    }

    if (start >= end) {
      return { success: false, error: "Check-out date must be after check-in date" }
    }

    // Check availability
    const availabilityPeriods = await db
      .select()
      .from(availability)
      .where(
        and(
          eq(availability.homeId, homeId),
          eq(availability.isAvailable, true),
          lte(availability.startDate, start),
          gte(availability.endDate, end)
        )
      )

    if (!availabilityPeriods.length) {
      return { success: false, error: "Selected dates are not available" }
    }

    // Check for existing bookings that overlap
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.homeId, homeId),
          // Booking is not rejected or cancelled
          // and overlaps with requested dates
        )
      )

    const hasConflict = existingBookings.some(booking => {
      if (booking.status === "rejected" || booking.status === "cancelled") {
        return false
      }
      
      const bookingStart = new Date(booking.startDate)
      const bookingEnd = new Date(booking.endDate)
      
      return (start < bookingEnd && end > bookingStart)
    })

    if (hasConflict) {
      return { success: false, error: "Selected dates conflict with existing booking" }
    }

    // Calculate total amount
    const nights = calculateNights(start, end)
    const totalAmount = nights * Number(home.pricePerNight)

    // Create Stripe PaymentIntent (authorized but not captured)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: "manual", // Don't capture until approved
      metadata: {
        homeId,
        guestId: session.user.id,
        hostId: host.id,
        startDate: startDate,
        endDate: endDate,
      },
    })

    // Create booking record
    const [booking] = await db
      .insert(bookings)
      .values({
        homeId,
        guestId: session.user.id,
        hostId: host.id,
        startDate: start,
        endDate: end,
        totalAmount: totalAmount.toString(),
        status: "pending",
        stripePaymentIntentId: paymentIntent.id,
        requestMessage: message,
      })
      .returning()

    // TODO: Send email notification to host

    revalidatePath("/bookings")
    revalidatePath(`/homes/${homeId}`)

    return { success: true, data: { id: booking.id } }
  } catch (error) {
    console.error("Error creating booking request:", error)
    return { success: false, error: "Failed to create booking request" }
  }
}

export async function approveBooking(
  bookingId: string,
  responseMessage?: string
): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.hostId !== session.user.id) {
      return { success: false, error: "You can only approve your own bookings" }
    }

    if (booking.status !== "pending") {
      return { success: false, error: "Booking is no longer pending" }
    }

    // Check if 24 hours have passed since booking creation
    const now = new Date()
    const bookingCreated = new Date(booking.createdAt)
    const hoursSinceCreated = (now.getTime() - bookingCreated.getTime()) / (1000 * 60 * 60)

    if (hoursSinceCreated > 24) {
      // Auto-decline if more than 24 hours have passed
      await db
        .update(bookings)
        .set({
          status: "rejected",
          responseMessage: "Automatically declined - host did not respond within 24 hours",
          respondedAt: now,
        })
        .where(eq(bookings.id, bookingId))

      return { success: false, error: "Booking request has expired" }
    }

    // Capture the payment
    if (booking.stripePaymentIntentId) {
      await stripe.paymentIntents.capture(booking.stripePaymentIntentId)
    }

    // Update booking status
    await db
      .update(bookings)
      .set({
        status: "approved",
        responseMessage,
        respondedAt: now,
      })
      .where(eq(bookings.id, bookingId))

    // TODO: Send confirmation emails to both guest and host

    revalidatePath("/bookings")
    revalidatePath(`/bookings/${bookingId}`)

    return { success: true, data: { success: true } }
  } catch (error) {
    console.error("Error approving booking:", error)
    return { success: false, error: "Failed to approve booking" }
  }
}

export async function rejectBooking(
  bookingId: string,
  responseMessage?: string
): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.hostId !== session.user.id) {
      return { success: false, error: "You can only reject your own bookings" }
    }

    if (booking.status !== "pending") {
      return { success: false, error: "Booking is no longer pending" }
    }

    // Cancel the Stripe PaymentIntent
    if (booking.stripePaymentIntentId) {
      await stripe.paymentIntents.cancel(booking.stripePaymentIntentId)
    }

    // Update booking status
    await db
      .update(bookings)
      .set({
        status: "rejected",
        responseMessage,
        respondedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))

    // TODO: Send rejection email to guest

    revalidatePath("/bookings")
    revalidatePath(`/bookings/${bookingId}`)

    return { success: true, data: { success: true } }
  } catch (error) {
    console.error("Error rejecting booking:", error)
    return { success: false, error: "Failed to reject booking" }
  }
}