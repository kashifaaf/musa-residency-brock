import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";
import { payments, bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeInstance;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  
  const db = getDb();
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await db
          .update(payments)
          .set({
            status: "authorized",
            authorizedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
        
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await db
          .update(payments)
          .set({
            status: "failed",
            failureReason: paymentIntent.last_payment_error?.message,
            updatedAt: new Date(),
          })
          .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
        
        break;
      }
      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge;
        
        if (charge.captured) {
          await db
            .update(payments)
            .set({
              status: "captured",
              capturedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(payments.stripePaymentIntentId, charge.payment_intent as string));
        }
        
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        
        await db
          .update(payments) 
          .set({
            status: "refunded",
            refundedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(payments.stripePaymentIntentId, charge.payment_intent as string));
        
        // Update booking status
        const payment = await db
          .select()
          .from(payments)
          .where(eq(payments.stripePaymentIntentId, charge.payment_intent as string))
          .limit(1);
          
        if (payment[0]) {
          await db
            .update(bookings)
            .set({
              status: "cancelled",
              cancelledAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, payment[0].bookingId));
        }
        
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}