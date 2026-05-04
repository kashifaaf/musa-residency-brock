"use server";

import { getDb } from '@/lib/db';
import { bookingRequests, homes, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth/config';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }
  return new Stripe(stripeSecretKey);
}

export async function createBookingRequest(
  homeId: string,
  startDate: Date,
  endDate: Date,
  totalPrice: number,
  guestMessage?: string
): Promise<ActionResult<{ id: string; clientSecret: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    
    // Get home and host info
    const [home] = await db
      .select({
        id: homes.id,
        hostId: homes.hostId,
        title: homes.title,
      })
      .from(homes)
      .where(eq(homes.id, homeId))
      .limit(1);

    if (!home) {
      return { success: false, error: 'Home not found' };
    }

    if (home.hostId === session.user.id) {
      return { success: false, error: 'Cannot book your own home' };
    }

    // Create Stripe payment intent
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: 'manual', // Don't capture until approved
      metadata: {
        homeId,
        guestId: session.user.id,
        hostId: home.hostId,
      },
    });

    // Create booking request with 24-hour expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const [bookingRequest] = await db
      .insert(bookingRequests)
      .values({
        homeId,
        guestId: session.user.id,
        hostId: home.hostId,
        startDate,
        endDate,
        totalPrice: totalPrice.toString(),
        guestMessage,
        stripePaymentIntentId: paymentIntent.id,
        expiresAt,
      })
      .returning({ id: bookingRequests.id });

    // TODO: Send email notification to host

    revalidatePath('/bookings');
    return {
      success: true,
      data: {
        id: bookingRequest.id,
        clientSecret: paymentIntent.client_secret!,
      },
    };
  } catch (error) {
    return { success: false, error: 'Failed to create booking request' };
  }
}

export async function approveBookingRequest(
  bookingRequestId: string,
  hostResponse?: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    
    // Get booking request
    const [booking] = await db
      .select()
      .from(bookingRequests)
      .where(
        and(
          eq(bookingRequests.id, bookingRequestId),
          eq(bookingRequests.hostId, session.user.id),
          eq(bookingRequests.status, 'pending')
        )
      )
      .limit(1);

    if (!booking) {
      return { success: false, error: 'Booking request not found or unauthorized' };
    }

    // Check if not expired
    if (new Date() > booking.expiresAt) {
      // Auto-decline expired requests
      await db
        .update(bookingRequests)
        .set({
          status: 'declined',
          hostResponse: 'Request expired',
          updatedAt: new Date(),
        })
        .where(eq(bookingRequests.id, bookingRequestId));
      
      return { success: false, error: 'Booking request has expired' };
    }

    // Capture payment
    if (booking.stripePaymentIntentId) {
      const stripe = getStripe();
      try {
        await stripe.paymentIntents.capture(booking.stripePaymentIntentId);
      } catch (stripeError) {
        return { success: false, error: 'Payment processing failed' };
      }
    }

    // Update booking request
    await db
      .update(bookingRequests)
      .set({
        status: 'approved',
        hostResponse,
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, bookingRequestId));

    // TODO: Send confirmation email to guest

    revalidatePath('/bookings');
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Failed to approve booking request' };
  }
}

export async function declineBookingRequest(
  bookingRequestId: string,
  hostResponse?: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    
    // Get booking request
    const [booking] = await db
      .select()
      .from(bookingRequests)
      .where(
        and(
          eq(bookingRequests.id, bookingRequestId),
          eq(bookingRequests.hostId, session.user.id),
          eq(bookingRequests.status, 'pending')
        )
      )
      .limit(1);

    if (!booking) {
      return { success: false, error: 'Booking request not found or unauthorized' };
    }

    // Cancel payment intent
    if (booking.stripePaymentIntentId) {
      const stripe = getStripe();
      try {
        await stripe.paymentIntents.cancel(booking.stripePaymentIntentId);
      } catch (stripeError) {
        // Log error but don't fail the decline
        console.error('Failed to cancel payment intent:', stripeError);
      }
    }

    // Update booking request
    await db
      .update(bookingRequests)
      .set({
        status: 'declined',
        hostResponse,
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, bookingRequestId));

    // TODO: Send notification email to guest

    revalidatePath('/bookings');
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Failed to decline booking request' };
  }
}

export async function getBookingRequests(): Promise<ActionResult<Array<{
  id: string;
  homeTitle: string;
  guestName: string;
  guestEmail: string;
  guestBio?: string;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  status: string;
  guestMessage?: string;
  hostResponse?: string;
  createdAt: Date;
  expiresAt: Date;
}>>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    
    const requests = await db
      .select({
        id: bookingRequests.id,
        homeTitle: homes.title,
        guestName: users.name,
        guestEmail: users.email,
        guestBio: users.bio,
        startDate: bookingRequests.startDate,
        endDate: bookingRequests.endDate,
        totalPrice: bookingRequests.totalPrice,
        status: bookingRequests.status,
        guestMessage: bookingRequests.guestMessage,
        hostResponse: bookingRequests.hostResponse,
        createdAt: bookingRequests.createdAt,
        expiresAt: bookingRequests.expiresAt,
      })
      .from(bookingRequests)
      .innerJoin(homes, eq(bookingRequests.homeId, homes.id))
      .innerJoin(users, eq(bookingRequests.guestId, users.id))
      .where(eq(bookingRequests.hostId, session.user.id))
      .orderBy(bookingRequests.createdAt);

    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: 'Failed to fetch booking requests' };
  }
}