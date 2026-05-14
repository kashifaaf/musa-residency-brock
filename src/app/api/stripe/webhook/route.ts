import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getDb } from '@/lib/db';
import { payments, bookings, notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

let __stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!__stripeInstance) {
    __stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return __stripeInstance;
}

const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    const target = getStripe() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === "function" ? value.bind(getStripe()) : value;
  },
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature')!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  const db = getDb();

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment status
        await db
          .update(payments)
          .set({
            status: 'authorized',
            authorizedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(payments.stripePaymentIntentId, paymentIntent.id));

        // Get payment and booking details
        const payment = await db.query.payments.findFirst({
          where: eq(payments.stripePaymentIntentId, paymentIntent.id),
          with: {
            booking: {
              with: {
                guest: true,
                host: true,
              },
            },
          },
        });

        if (payment) {
          // Notify guest
          await db.insert(notifications).values({
            id: nanoid(),
            userId: payment.booking.guestId,
            type: 'payment_success',
            title: 'Payment Successful',
            message: 'Your payment has been processed successfully.',
            data: { bookingId: payment.booking.id },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment status
        await db
          .update(payments)
          .set({
            status: 'failed',
            failedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(payments.stripePaymentIntentId, paymentIntent.id));

        // Get payment and booking details
        const payment = await db.query.payments.findFirst({
          where: eq(payments.stripePaymentIntentId, paymentIntent.id),
          with: {
            booking: true,
          },
        });

        if (payment) {
          // Update booking status
          await db
            .update(bookings)
            .set({
              status: 'declined',
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, payment.bookingId));

          // Notify guest
          await db.insert(notifications).values({
            id: nanoid(),
            userId: payment.booking.guestId,
            type: 'payment_failed',
            title: 'Payment Failed',
            message: 'There was an issue processing your payment. Please try again.',
            data: { bookingId: payment.booking.id },
          });
        }
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        
        if (charge.payment_intent) {
          // Update payment to captured
          await db
            .update(payments)
            .set({
              status: 'captured',
              capturedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(payments.stripePaymentIntentId, charge.payment_intent as string));
        }
        break;
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}