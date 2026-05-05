import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { getDb } from '@/lib/db';
import { bookingRequests, homes, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendEmail, generateBookingApprovedEmail } from '@/lib/email';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const db = getDb();

    // Get booking request with home and guest details
    const bookingData = await db
      .select({
        id: bookingRequests.id,
        hostId: bookingRequests.hostId,
        guestId: bookingRequests.guestId,
        status: bookingRequests.status,
        hostResponseDeadline: bookingRequests.hostResponseDeadline,
        home: {
          title: homes.title,
        },
        guest: {
          name: users.name,
          email: users.email,
        },
      })
      .from(bookingRequests)
      .innerJoin(homes, eq(bookingRequests.homeId, homes.id))
      .innerJoin(users, eq(bookingRequests.guestId, users.id))
      .where(eq(bookingRequests.id, id))
      .limit(1);

    if (!bookingData.length) {
      return NextResponse.json(
        { success: false, error: 'Booking request not found' },
        { status: 404 }
      );
    }

    const booking = bookingData[0];

    // Verify the user is the host
    if (booking.hostId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if booking is still pending
    if (booking.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Booking request is no longer pending' },
        { status: 400 }
      );
    }

    // Check if response deadline has passed
    if (new Date() > booking.hostResponseDeadline) {
      return NextResponse.json(
        { success: false, error: 'Response deadline has passed' },
        { status: 400 }
      );
    }

    // Update booking status to approved
    await db
      .update(bookingRequests)
      .set({
        status: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, id));

    // Send email notification to guest
    await sendEmail({
      to: booking.guest.email,
      subject: 'Booking Approved - Musa Residency',
      html: generateBookingApprovedEmail(
        booking.guest.name,
        booking.home.title
      ),
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Booking request approved successfully' },
    });
  } catch (error) {
    console.error('Approve booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}