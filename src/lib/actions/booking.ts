'use server';

import { eq, and, lte, gte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb, bookings, homes, availability, users } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import { sendEmail } from '@/lib/email';
import { ActionResult } from '@/types';
import { addHours, calculateNights, formatCurrency, formatDate } from '@/lib/utils';

function getNextAuthUrl() {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

interface CreateBookingRequestData {
  homeId: string;
  startDate: string;
  endDate: string;
  guests: number;
  message?: string;
}

export async function createBookingRequest(
  data: CreateBookingRequestData
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'You must be signed in to make a booking request',
      };
    }

    const db = getDb();
    const stripe = getStripe();

    // Get home details
    const home = await db
      .select({
        id: homes.id,
        hostId: homes.hostId,
        title: homes.title,
        pricePerNight: homes.pricePerNight,
        maxGuests: homes.maxGuests,
        host: {
          email: users.email,
          name: users.name,
        },
      })
      .from(homes)
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(eq(homes.id, data.homeId))
      .limit(1);

    if (home.length === 0) {
      return {
        success: false,
        error: 'Home not found',
      };
    }

    const homeData = home[0];

    // Validate guest count
    if (data.guests > homeData.maxGuests) {
      return {
        success: false,
        error: `This home can accommodate maximum ${homeData.maxGuests} guests`,
      };
    }

    // Check for conflicting bookings
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.homeId, data.homeId),
          eq(bookings.status, 'approved'),
          lte(bookings.startDate, endDate),
          gte(bookings.endDate, startDate)
        )
      );

    if (conflictingBookings.length > 0) {
      return {
        success: false,
        error: 'These dates are not available',
      };
    }

    // Calculate total amount
    const nights = calculateNights(startDate, endDate);
    const pricePerNight = parseFloat(homeData.pricePerNight);
    const totalAmount = nights * pricePerNight;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: 'manual', // Don't capture until approved
      metadata: {
        homeId: data.homeId,
        guestId: user.id,
        hostId: homeData.hostId,
      },
    });

    // Create booking record
    const bookingData = {
      homeId: data.homeId,
      guestId: user.id,
      startDate,
      endDate,
      guests: data.guests,
      totalAmount: totalAmount.toString(),
      status: 'pending' as const,
      message: data.message || null,
      stripePaymentIntentId: paymentIntent.id,
      expiresAt: addHours(new Date(), 24), // 24 hour response window
    };

    const newBooking = await db.insert(bookings).values(bookingData).returning({ id: bookings.id });

    // Send notification email to host
    if (homeData.host?.email) {
      const nextAuthUrl = getNextAuthUrl();
      await sendEmail(
        homeData.host.email,
        'New Booking Request - Musa Residency',
        `
        <h2>You have a new booking request!</h2>
        <p><strong>Property:</strong> ${homeData.title}</p>
        <p><strong>Dates:</strong> ${formatDate(startDate)} - ${formatDate(endDate)}</p>
        <p><strong>Guests:</strong> ${data.guests}</p>
        <p><strong>Total:</strong> ${formatCurrency(totalAmount)}</p>
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
        <p>Please respond within 24 hours to maintain your host rating.</p>
        <a href="${nextAuthUrl}/dashboard/bookings/${newBooking[0].id}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">View Request</a>
        `
      );
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      data: { id: newBooking[0].id },
    };
  } catch (error) {
    console.error('Error creating booking request:', error);
    return {
      success: false,
      error: 'Failed to create booking request',
    };
  }
}

export async function approveBooking(bookingId: string): Promise<ActionResult<{ paymentUrl: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const db = getDb();

    // Get booking details
    const booking = await db
      .select({
        id: bookings.id,
        homeId: bookings.homeId,
        guestId: bookings.guestId,
        status: bookings.status,
        stripePaymentIntentId: bookings.stripePaymentIntentId,
        expiresAt: bookings.expiresAt,
        home: {
          hostId: homes.hostId,
          title: homes.title,
        },
        guest: {
          email: users.email,
          name: users.name,
        },
      })
      .from(bookings)
      .leftJoin(homes, eq(bookings.homeId, homes.id))
      .leftJoin(users, eq(bookings.guestId, users.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    const bookingData = booking[0];

    // Check if user is the host
    if (bookingData.home?.hostId !== user.id) {
      return {
        success: false,
        error: 'You can only approve bookings for your own properties',
      };
    }

    // Check if booking is still pending
    if (bookingData.status !== 'pending') {
      return {
        success: false,
        error: 'This booking has already been processed',
      };
    }

    // Check if booking hasn't expired
    if (new Date() > bookingData.expiresAt) {
      await db.update(bookings)
        .set({ status: 'declined', updatedAt: new Date() })
        .where(eq(bookings.id, bookingId));
      
      return {
        success: false,
        error: 'This booking request has expired',
      };
    }

    // Update booking status
    await db.update(bookings)
      .set({ status: 'approved', updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));

    // Send approval email to guest with payment link
    if (bookingData.guest?.email && bookingData.stripePaymentIntentId) {
      const nextAuthUrl = getNextAuthUrl();
      const paymentUrl = `${nextAuthUrl}/bookings/${bookingId}/payment`;
      
      await sendEmail(
        bookingData.guest.email,
        'Booking Approved - Complete Your Payment',
        `
        <h2>Great news! Your booking has been approved!</h2>
        <p><strong>Property:</strong> ${bookingData.home?.title}</p>
        <p>Please complete your payment within 24 hours to secure your booking.</p>
        <a href="${paymentUrl}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">Complete Payment</a>
        `
      );

      revalidatePath('/dashboard');
      
      return {
        success: true,
        data: { paymentUrl },
      };
    }

    return {
      success: false,
      error: 'Failed to send approval notification',
    };
  } catch (error) {
    console.error('Error approving booking:', error);
    return {
      success: false,
      error: 'Failed to approve booking',
    };
  }
}

export async function declineBooking(bookingId: string): Promise<ActionResult<void>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const db = getDb();

    // Get booking details
    const booking = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        home: {
          hostId: homes.hostId,
          title: homes.title,
        },
        guest: {
          email: users.email,
          name: users.name,
        },
      })
      .from(bookings)
      .leftJoin(homes, eq(bookings.homeId, homes.id))
      .leftJoin(users, eq(bookings.guestId, users.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    const bookingData = booking[0];

    // Check if user is the host
    if (bookingData.home?.hostId !== user.id) {
      return {
        success: false,
        error: 'You can only decline bookings for your own properties',
      };
    }

    // Check if booking is still pending
    if (bookingData.status !== 'pending') {
      return {
        success: false,
        error: 'This booking has already been processed',
      };
    }

    // Update booking status
    await db.update(bookings)
      .set({ status: 'declined', updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));

    // Send decline email to guest
    if (bookingData.guest?.email) {
      const nextAuthUrl = getNextAuthUrl();
      await sendEmail(
        bookingData.guest.email,
        'Booking Request Update',
        `
        <h2>Booking Request Update</h2>
        <p>Unfortunately, your booking request for ${bookingData.home?.title} could not be accommodated.</p>
        <p>We encourage you to browse other amazing properties on Musa Residency.</p>
        <a href="${nextAuthUrl}/search" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">Search Other Homes</a>
        `
      );
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error declining booking:', error);
    return {
      success: false,
      error: 'Failed to decline booking',
    };
  }
}