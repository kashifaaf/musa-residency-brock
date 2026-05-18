import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { BOOKING_STATUS } from "@/lib/constants"
import { getStripe } from "@/lib/stripe"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, bookingId), eq(bookings.guestId, session.user.id)),
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    if (booking.status !== BOOKING_STATUS.APPROVED) {
      return NextResponse.json(
        { success: false, error: "Booking must be approved before payment" },
        { status: 400 }
      )
    }

    if (booking.stripePaymentIntentId) {
      try {
        const stripe = getStripe()
        await stripe.paymentIntents.capture(booking.stripePaymentIntentId)

        await db
          .update(bookings)
          .set({
            status: BOOKING_STATUS.PAID,
            stripePaymentStatus: "captured",
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, bookingId))

        return NextResponse.json({ success: true, data: { status: "paid" } })
      } catch (stripeError) {
        console.error("Stripe capture error:", stripeError)
        return NextResponse.json(
          { success: false, error: "Payment capture failed" },
          { status: 500 }
        )
      }
    }

    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const stripe = getStripe()

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: (booking.currency || "USD").toLowerCase(),
            product_data: {
              name: `Booking at Musa Residency`,
              description: `${booking.checkIn} to ${booking.checkOut}`,
            },
            unit_amount: Math.round(Number(booking.totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/bookings/${bookingId}?payment=success`,
      cancel_url: `${appUrl}/bookings/${bookingId}?payment=cancelled`,
      metadata: {
        bookingId,
      },
    })

    return NextResponse.json({ success: true, data: { url: checkoutSession.url } })
  } catch (error) {
    console.error("POST /api/bookings/[id]/pay error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    )
  }
}