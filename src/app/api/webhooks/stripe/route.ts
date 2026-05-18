import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { BOOKING_STATUS } from "@/lib/constants"
import { getStripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not set")
      return NextResponse.json({ error: "Server config error" }, { status: 500 })
    }

    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        await db
          .update(bookings)
          .set({
            status: BOOKING_STATUS.PAID,
            stripePaymentStatus: "paid",
            stripePaymentIntentId: session.payment_intent,
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, bookingId))
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}