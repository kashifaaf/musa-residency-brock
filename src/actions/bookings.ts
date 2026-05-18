"use server"

import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, listings, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { BOOKING_STATUS, BOOKING_EXPIRATION_HOURS } from "@/lib/constants"
import { getExpirationDate } from "@/lib/utils"
import { sendBookingStatusEmail } from "@/lib/email"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function respondToBooking(
  bookingId: string,
  action: "approve" | "decline",
  hostMessage?: string
): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, bookingId), eq(bookings.hostId, session.user.id)),
      with: {
        listing: true,
        guest: true,
      },
    })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      return { success: false, error: `Cannot respond to a booking with status: ${booking.status}` }
    }

    const now = new Date()
    if (booking.expiresAt && now > booking.expiresAt) {
      await db
        .update(bookings)
        .set({ status: BOOKING_STATUS.EXPIRED, updatedAt: now })
        .where(eq(bookings.id, bookingId))
      return { success: false, error: "This booking request has expired" }
    }

    const newStatus = action === "approve" ? BOOKING_STATUS.APPROVED : BOOKING_STATUS.DECLINED

    await db
      .update(bookings)
      .set({
        status: newStatus,
        hostMessage: hostMessage || null,
        respondedAt: now,
        updatedAt: now,
      })
      .where(eq(bookings.id, bookingId))

    if (booking.guest?.email) {
      await sendBookingStatusEmail(
        booking.guest.email,
        booking.guest.name || "Guest",
        booking.listing?.title || "Listing",
        newStatus,
        bookingId
      )
    }

    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath("/bookings")
    revalidatePath("/dashboard")

    return { success: true, data: null }
  } catch (error) {
    console.error("respondToBooking error:", error)
    return { success: false, error: "Failed to respond to booking" }
  }
}

export async function cancelBooking(bookingId: string): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: { listing: true, guest: true, host: true },
    })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    const isGuest = booking.guestId === session.user.id
    const isHost = booking.hostId === session.user.id

    if (!isGuest && !isHost) {
      return { success: false, error: "You don't have permission to cancel this booking" }
    }

    const cancellableStatuses = [
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.APPROVED,
    ]
    if (!cancellableStatuses.includes(booking.status as any)) {
      return { success: false, error: `Cannot cancel a booking with status: ${booking.status}` }
    }

    await db
      .update(bookings)
      .set({ status: BOOKING_STATUS.CANCELLED, updatedAt: new Date() })
      .where(eq(bookings.id, bookingId))

    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath("/bookings")
    revalidatePath("/dashboard")

    return { success: true, data: null }
  } catch (error) {
    console.error("cancelBooking error:", error)
    return { success: false, error: "Failed to cancel booking" }
  }
}