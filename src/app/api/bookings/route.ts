import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, listings, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { BOOKING_EXPIRATION_HOURS } from "@/lib/constants"
import { calculateNights, getExpirationDate } from "@/lib/utils"
import { sendBookingRequestEmail } from "@/lib/email"
import { getStripe } from "@/lib/stripe"

const bookingRequestSchema = z.object({
  listingId: z.string().uuid(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = bookingRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid data" },
        { status: 400 }
      )
    }

    const { listingId, checkIn, checkOut, guests, message } = parsed.data

    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, listingId),
      with: { host: true },
    })

    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 })
    }

    if (!listing.isPublished) {
      return NextResponse.json(
        { success: false, error: "This listing is not currently available" },
        { status: 400 }
      )
    }

    if (listing.hostId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot book your own listing" },
        { status: 400 }
      )
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = calculateNights(checkInDate, checkOutDate)

    if (nights <= 0) {
      return NextResponse.json(
        { success: false, error: "Check-out must be after check-in" },
        { status: 400 }
      )
    }

    if (nights < (listing.minimumStay || 1)) {
      return NextResponse.json(
        { success: false, error: `Minimum stay is ${listing.minimumStay} nights` },
        { status: 400 }
      )
    }

    const totalPrice = nights * Number(listing.pricePerNight)

    let stripePaymentIntentId: string | null = null
    try {
      const stripe = getStripe()
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: (listing.currency || "USD").toLowerCase(),
        metadata: {
          listingId,
          guestId: session.user.id,
          checkIn,
          checkOut,
        },
        capture_method: "manual",
      })
      stripePaymentIntentId = paymentIntent.id
    } catch (stripeError) {
      console.error("Stripe payment intent creation failed:", stripeError)
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        listingId,
        guestId: session.user.id,
        hostId: listing.hostId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: totalPrice.toFixed(2),
        currency: listing.currency || "USD",
        status: "pending",
        guestMessage: message || null,
        stripePaymentIntentId,
        expiresAt: getExpirationDate(BOOKING_EXPIRATION_HOURS),
      })
      .returning()

    const guest = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    })

    if (listing.host?.email) {
      await sendBookingRequestEmail(
        listing.host.email,
        listing.host.name || "Host",
        guest?.name || "A guest",
        listing.title,
        checkIn,
        checkOut,
        booking.id
      )
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error("POST /api/bookings error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}