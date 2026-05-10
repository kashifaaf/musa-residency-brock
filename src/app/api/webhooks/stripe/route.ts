import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDb } from '@/lib/db';
import { bookings, notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
let __stripeInstance: ReturnType<typeof getStripe> | null = null
function getStripe() {
  if (!__stripeInstance) {
    __stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})
  }
  return __stripeInstance
}
const stripe = new Proxy({} as ReturnType<typeof getStripe>, {
  get(_, prop) {
    const target = getStripe() as Record<string | symbol, unknown>
    const value = target[prop]
    return typeof value === "function" ? value.bind(target) : value
  },
})
export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const db = getDb();
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update booking payment status
        await db.update(bookings)
          .set({ 
            paymentStatus: 'captured',
            updatedAt: new Date(),
          })
          .where(eq(bookings.stripePaymentIntentId, paymentIntent.id));
        // Create notification for host
        const booking = await db.select()
          .from(bookings)
          .where(eq(bookings.stripePaymentIntentId, paymentIntent.id))
          .limit(1);
        if (booking[0]) {
          await db.insert(notifications).values({
            userId: booking[0].hostId,
            type: 'payment_success',
            title: 'Payment Received',
            content: `Payment has been received for your booking.`,
            relatedBookingId: booking[0].id,
            emailSent: false,
          });
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update booking payment status
        await db.update(bookings)
          .set({ 
            paymentStatus: 'failed',
            status: 'declined',
            updatedAt: new Date(),
          })
          .where(eq(bookings.stripePaymentIntentId, paymentIntent.id));
        // Create notification for guest
        const booking = await db.select()
          .from(bookings)
          .where(eq(bookings.stripePaymentIntentId, paymentIntent.id))
          .limit(1);
        if (booking[0]) {
          await db.insert(notifications).values({
            userId: booking[0].guestId,
            type: 'payment_failed',
            title: 'Payment Failed',
            content: `Your payment for the booking could not be processed.`,
            relatedBookingId: booking[0].id,
            emailSent: false,
          });
        }
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}