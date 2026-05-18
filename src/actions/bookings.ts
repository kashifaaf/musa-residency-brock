"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, payments, listings, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { calculateTotalPrice, getResponseDeadline } from "@/lib/utils"
import { HOST_RESPONSE_WINDOW_HOURS } from "@/lib/constants"
import { getStripe } from "@/lib/stripe"
import { sendBookingRequestEmail, sendBookingStatusEmail } from "@/lib/email"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createBookingRequest(input: {
  listingId: string
  checkIn: string
  checkOut: string
  guestMessage?: string
}): Promise<ActionResult<{ bookingId: string; clientSecret: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const listing = await db.query.listings.findFirst({
      where: and(eq(listings.id, input.listingId), eq(listings.isPublished, true)),
      with: { host: true },
    })

    if (!listing) {
      return { success: false, error: "Listing not found" }
    }

    if (listing.hostId === session.user.id) {
      return { success: false, error: "You cannot book your own listing" }
    }

    const checkIn = new Date(input.checkIn)
    const checkOut = new Date(input.checkOut)

    if (checkIn >= checkOut) {
      return { success: false, error: "Check-in must be before check-out" }
    }

    const diffDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < listing.minStayNights) {
      return { success: false, error: `Minimum stay is ${listing.minStayNights} nights` }
    }

    const totalPrice = calculateTotalPrice(listing.pricePerNight, checkIn, checkOut)
    const respondBy = getResponseDeadline(new Date(), HOST_RESPONSE_WINDOW_HOURS)

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "usd",
      capture_method: "manual",
      metadata: {
        listingId: listing.id,
        guestId: session.user.id,
        hostId: listing.hostId,
      },
    })

    const [booking] = await db
      .insert(bookings)
      .values({
        listingId: listing.id,
        guestId: session.user.id,
        hostId: listing.hostId,
        checkIn,
        checkOut,
        totalPrice,
        status: "pending",
        guestMessage: input.guestMessage || null,
        respondBy,
      })
      .returning({ id: bookings.id })

    await db.insert(payments).values({
      bookingId: booking.id,
      stripePaymentIntentId: paymentIntent.id,
      amount: totalPrice * 100,
      currency: "usd",
      status: "authorized",
    })

    try {
      const guest = await db.query.users.findFirst({ where: eq(users.id, session.user.id) })
      if (listing.host?.email && guest?.name) {
        await sendBookingRequestEmail(
          listing.host.email,
          listing.host.name || "Host",
          guest.name,
          listing.title,
          checkIn.toLocaleDateString(),
          checkOut.toLocaleDateString(),
          booking.id
        )
      }
    } catch (emailErr) {
      console.error("Failed to send booking request email:", emailErr)
    }

    revalidatePath("/bookings")
    revalidatePath("/dashboard")

    return {
      success: true,
      data: { bookingId: booking.id, clientSecret: paymentIntent.client_secret! },
    }
  } catch (error) {
    console.error("createBookingRequest error:", error)
    return { success: false, error: "Failed to create booking request" }
  }
}

export async function respondToBooking(
  bookingId: string,
  action: "approve" | "decline",
  note?: string
): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, bookingId), eq(bookings.hostId, session.user.id)),
      with: { payment: true, guest: true, listing: true },
    })

    if (!booking) {
      return { success: false, error: "Booking not found or unauthorized" }
    }

    if (booking.status !== "pending") {
      return { success: false, error: "This booking has already been responded to" }
    }

    if (new Date() > booking.respondBy) {
      await db
        .update(bookings)
        .set({ status: "expired", updatedAt: new Date() })
        .where(eq(bookings.id, bookingId))
      return { success: false, error: "Response window has expired" }
    }

    const stripe = getStripe()

    if (action === "approve") {
      if (booking.payment?.stripePaymentIntentId) {
        await stripe.paymentIntents.capture(booking.payment.stripePaymentIntentId)
        await db
          .update(payments)
          .set({ status: "captured", updatedAt: new Date() })
          .where(eq(payments.bookingId, bookingId))
      }

      await db
        .update(bookings)
        .set({
          status: "approved",
          hostResponseNote: note || null,
          respondedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, bookingId))
    } else {
      if (booking.payment?.stripePaymentIntentId) {
        await stripe.paymentIntents.cancel(booking.payment.stripePaymentIntentId)
        await db
          .update(payments)
          .set({ status: "refunded", updatedAt: new Date() })
          .where(eq(payments.bookingId, bookingId))
      }

      await db
        .update(bookings)
        .set({
          status: "declined",
          hostResponseNote: note || null,
          respondedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, bookingId))
    }

    try {
      if (booking.guest?.email) {
        await sendBookingStatusEmail(
          booking.guest.email,
          booking.guest.name || "Guest",
          booking.listing?.title || "Listing",
          action === "approve" ? "approved" : "declined",
          bookingId
        )
      }
    } catch (emailErr) {
      console.error("Failed to send booking status email:", emailErr)
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: { payment: true },
    })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    if (booking.guestId !== session.user.id && booking.hostId !== session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    if (booking.status !== "pending" && booking.status !== "approved") {
      return { success: false, error: "This booking cannot be cancelled" }
    }

    const stripe = getStripe()
    if (booking.payment?.stripePaymentIntentId) {
      try {
        if (booking.status === "approved") {
          await stripe.refunds.create({ payment_intent: booking.payment.stripePaymentIntentId })
        } else {
          await stripe.paymentIntents.cancel(booking.payment.stripePaymentIntentId)
        }
        await db
          .update(payments)
          .set({ status: "refunded", updatedAt: new Date() })
          .where(eq(payments.bookingId, bookingId))
      } catch (stripeErr) {
        console.error("Stripe cancellation error:", stripeErr)
      }
    }

    await db
      .update(bookings)
      .set({ status: "cancelled", updatedAt: new Date() })
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