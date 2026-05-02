'use server';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { bookingRequests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ActionResult } from '@/lib/types';

interface BookingRequestData {
  homeId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  message: string;
  totalAmount: number;
}

export async function createBookingRequest(data: BookingRequestData): Promise<ActionResult<string>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const db = getDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const [booking] = await db
      .insert(bookingRequests)
      .values({
        homeId: data.homeId,
        guestId: user.id,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        guestCount: data.guestCount,
        message: data.message,
        totalAmount: data.totalAmount * 100, // Convert to cents
        status: 'pending',
      })
      .returning({ id: bookingRequests.id });

    return { success: true, data: booking.id };
  } catch (error) {
    console.error('Create booking request error:', error);
    return { success: false, error: 'Failed to create booking request' };
  }
}

export async function approveBookingRequest(bookingId: string): Promise<ActionResult<void>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const db = getDb();
    await db
      .update(bookingRequests)
      .set({ 
        status: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, bookingId));

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Approve booking error:', error);
    return { success: false, error: 'Failed to approve booking' };
  }
}

export async function declineBookingRequest(bookingId: string): Promise<ActionResult<void>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const db = getDb();
    await db
      .update(bookingRequests)
      .set({ 
        status: 'declined',
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, bookingId));

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Decline booking error:', error);
    return { success: false, error: 'Failed to decline booking' };
  }
}