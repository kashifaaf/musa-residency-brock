import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { getDb } from '@/lib/db';
import { bookingRequests, homes, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getStripe } from '@/lib/stripe';
import { sendEmail, generateBookingRequestEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { homeId, startDate, endDate, guestCount, message } = await request.json();

    if (!homeId || !startDate || !endDate || !guestCount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get home details
    const homeData = await db
      .select({
        id: homes.id,
        hostId: homes.hostId,
        title: homes.title,
        pricePerNight: homes.pricePerNight,
        maxGuests: homes.maxGuests,
        host: {
          name: users.name,
          email: users.email,
        },
      })
      .from(homes)
      .innerJoin(users, eq(homes.hostId, users.id))
      .where(eq(homes.id, homeId))
      .limit(1);

    if (!homeData.length) {
      return NextResponse.json(
        { success: false, error: 'Home not found' },
        { status: 404 }
      );
    }

    const home = homeData[0];

    if (home.hostId === session.userId) {
      return NextResponse.json(
        { success: false, error: 'Cannot book your own home' },
        { status: 400 }
      );
    }

    if (guestCount > home.maxGuests) {
      return NextResponse.json(
        { success: false, error: 'Guest count exceeds maximum allowed' },
        { status: 400 }
      );
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * parseFloat(home.pricePerNight);

    // Create Stripe Payment Intent
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: 'manual', // Don't capture until booking is approved
      metadata: {
        homeId,
        guestId: session.userId,
        hostId: home.hostId,
      },
    });

    // Create booking request
    const hostResponseDeadline = new Date();
    hostResponseDeadline.setHours(hostResponseDeadline.getHours() + 24);

    const bookingRequest = await db
      .insert(bookingRequests)
      .values({
        homeId,
        guestId: session.userId,
        hostId: home.hostId,
        startDate: start,
        endDate: end,
        totalPrice: totalPrice.toString(),
        guestCount,
        message: message || null,
        paymentIntentId: paymentIntent.id,
        hostResponseDeadline,
      })
      .returning();

    // Get guest info for email
    const guestData = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    // Send email notification to host
    await sendEmail({
      to: home.host.email,
      subject: 'New Booking Request - Musa Residency',
      html: generateBookingRequestEmail(
        home.host.name,
        guestData[0]?.name || 'Guest',
        home.title
      ),
    });

    return NextResponse.json({
      success: true,
      data: {
        bookingRequest: bookingRequest[0],
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}