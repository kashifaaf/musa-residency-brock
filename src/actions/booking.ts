"use server";

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { bookings, payments, notifications, availability } from '@/lib/db/schema';
import { and, gte, lte, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import type { CreateBookingInput, ApiResponse, Booking } from '@/types';

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

export async function createBooking(input: CreateBookingInput): Promise<ApiResponse<Booking>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Validate home exists and get host info
    const home = await db.query.homes.findFirst({
      where: (homes, { eq }) => eq(homes.id, input.homeId),
    });

    if (!home) {
      return { success: false, error: 'Home not found' };
    }

    if (home.hostId === session.user.id) {
      return { success: false, error: 'Cannot book your own home' };
    }

    // Check availability
    const availabilityCheck = await db.query.availability.findFirst({
      where: and(
        eq(availability.homeId, input.homeId),
        lte(availability.startDate, input.checkIn),
        gte(availability.endDate, input.checkOut),
        eq(availability.isAvailable, true)
      ),
    });

    if (!availabilityCheck) {
      return { success: false, error: 'Home not available for selected dates' };
    }

    // Check for overlapping bookings
    const existingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.homeId, input.homeId),
        eq(bookings.status, 'approved'),
        lte(bookings.checkIn, input.checkOut),
        gte(bookings.checkOut, input.checkIn)
      ),
    });

    if (existingBookings.length > 0) {
      return { success: false, error: 'Dates already booked' };
    }

    // Calculate total price
    const nights = Math.ceil((input.checkOut.getTime() - input.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const pricePerNight = 100; // Fixed price for MVP
    const totalPrice = nights * pricePerNight;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: '', // Will update after booking created
      },
    });

    // Create booking
    const bookingId = nanoid();
    const [booking] = await db.insert(bookings).values({
      id: bookingId,
      homeId: input.homeId,
      guestId: session.user.id,
      hostId: home.hostId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      totalPrice: totalPrice.toString(),
      guestCount: input.guestCount,
      message: input.message,
      status: 'pending',
    }).returning();

    // Create payment record
    await db.insert(payments).values({
      id: nanoid(),
      bookingId: booking.id,
      stripePaymentIntentId: paymentIntent.id,
      amount: totalPrice.toString(),
      currency: 'usd',
      status: 'pending',
    });

    // Update payment intent with booking ID
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { bookingId: booking.id },
    });

    // Notify host
    await db.insert(notifications).values({
      id: nanoid(),
      userId: home.hostId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `You have a new booking request for ${home.title}`,
      data: { bookingId: booking.id },
    });

    revalidatePath('/bookings');
    revalidatePath('/dashboard');

    return { success: true, data: booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}

export async function approveBooking(bookingId: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Verify host owns the booking
    const booking = await db.query.bookings.findFirst({
      where: (bookings, { and, eq }) => 
        and(eq(bookings.id, bookingId), eq(bookings.hostId, session.user.id)),
      with: { payment: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status !== 'pending') {
      return { success: false, error: 'Booking already processed' };
    }

    // Update booking status
    await db
      .update(bookings)
      .set({
        status: 'approved',
        hostResponseAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    // Capture payment
    if (booking.payment?.stripePaymentIntentId) {
      await stripe.paymentIntents.capture(booking.payment.stripePaymentIntentId);
    }

    // Notify guest
    await db.insert(notifications).values({
      id: nanoid(),
      userId: booking.guestId,
      type: 'booking_approved',
      title: 'Booking Approved!',
      message: 'Your booking request has been approved by the host',
      data: { bookingId: booking.id },
    });

    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Error approving booking:', error);
    return { success: false, error: 'Failed to approve booking' };
  }
}

export async function declineBooking(bookingId: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Verify host owns the booking
    const booking = await db.query.bookings.findFirst({
      where: (bookings, { and, eq }) => 
        and(eq(bookings.id, bookingId), eq(bookings.hostId, session.user.id)),
      with: { payment: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status !== 'pending') {
      return { success: false, error: 'Booking already processed' };
    }

    // Update booking status
    await db
      .update(bookings)
      .set({
        status: 'declined',
        hostResponseAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    // Cancel payment intent
    if (booking.payment?.stripePaymentIntentId) {
      await stripe.paymentIntents.cancel(booking.payment.stripePaymentIntentId);
    }

    // Notify guest
    await db.insert(notifications).values({
      id: nanoid(),
      userId: booking.guestId,
      type: 'booking_declined',
      title: 'Booking Declined',
      message: 'Your booking request has been declined by the host',
      data: { bookingId: booking.id },
    });

    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Error declining booking:', error);
    return { success: false, error: 'Failed to decline booking' };
  }
}

export async function cancelBooking(bookingId: string, reason: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Get booking and verify user can cancel
    const booking = await db.query.bookings.findFirst({
      where: (bookings, { and, eq, or }) => 
        and(
          eq(bookings.id, bookingId),
          or(
            eq(bookings.guestId, session.user.id),
            eq(bookings.hostId, session.user.id)
          )
        ),
      with: { payment: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return { success: false, error: 'Cannot cancel this booking' };
    }

    // Update booking
    await db
      .update(bookings)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: session.user.id,
        cancellationReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    // Handle payment refund if approved
    if (booking.status === 'approved' && booking.payment?.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.payment.stripePaymentIntentId,
      });

      await db
        .update(payments)
        .set({
          status: 'refunded',
          refundedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payments.bookingId, bookingId));
    }

    // Notify other party
    const otherUserId = booking.guestId === session.user.id ? booking.hostId : booking.guestId;
    await db.insert(notifications).values({
      id: nanoid(),
      userId: otherUserId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `The booking has been cancelled: ${reason}`,
      data: { bookingId: booking.id },
    });

    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, error: 'Failed to cancel booking' };
  }
}