'use server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { bookings, listings, notifications, availability } from '@/lib/db/schema';
import { eq, and, or, lte, gte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};
interface CreateBookingInput {
  listingId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  guestMessage?: string;
  totalPrice: number;
  currency: string;
}
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
export async function createBooking(input: CreateBookingInput): Promise<ActionResult<{ id: string; clientSecret: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    const db = getDb();
    
    // Get listing details
    const [listing] = await db.select()
      .from(listings)
      .where(eq(listings.id, input.listingId))
      .limit(1);
      
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }
    
    if (listing.hostId === session.user.id) {
      return { success: false, error: 'You cannot book your own listing' };
    }
    
    // Check availability
    const conflicts = await db.select()
      .from(availability)
      .where(
        and(
          eq(availability.listingId, input.listingId),
          eq(availability.isBlocked, true),
          lte(availability.startDate, input.checkOut),
          gte(availability.endDate, input.checkIn)
        )
      );
      
    if (conflicts.length > 0) {
      return { success: false, error: 'These dates are not available' };
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(input.totalPrice * 100), // Convert to cents
      currency: input.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        listingId: input.listingId,
        guestId: session.user.id,
      },
    });
    
    // Create booking
    const [booking] = await db.insert(bookings).values({
      listingId: input.listingId,
      hostId: listing.hostId,
      guestId: session.user.id,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guestCount: input.guestCount,
      totalPrice: input.totalPrice.toString(),
      currency: input.currency,
      guestMessage: input.guestMessage,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      paymentStatus: 'pending',
    }).returning();
    
    // Create notification for host
    await db.insert(notifications).values({
      userId: listing.hostId,
      type: 'booking_request',
      title: 'New booking request',
      content: `You have a new booking request for ${listing.title}`,
      relatedBookingId: booking.id,
      relatedListingId: listing.id,
    });
    
    revalidatePath('/bookings');
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      data: { 
        id: booking.id,
        clientSecret: paymentIntent.client_secret!,
      },
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}
export async function respondToBooking(
  bookingId: string,
  action: 'approve' | 'decline',
  message?: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    const db = getDb();
    
    // Get booking details
    const [booking] = await db.select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
      
    if (!booking || booking.hostId !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }
    
    if (booking.status !== 'pending') {
      return { success: false, error: 'Booking has already been processed' };
    }
    
    // Update booking status
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'declined',
      hostMessage: message,
      updatedAt: new Date(),
    };
    
    if (action === 'approve') {
      updateData.approvedAt = new Date();
      
      // Block dates in availability
      await db.insert(availability).values({
        listingId: booking.listingId,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        isBlocked: true,
      });
      
      // Capture payment
      try {
        await stripe.paymentIntents.capture(booking.stripePaymentIntentId!);
        updateData.paymentStatus = 'captured';
      } catch (error) {
        console.error('Failed to capture payment:', error);
        return { success: false, error: 'Failed to process payment' };
      }
    } else {
      updateData.declinedAt = new Date();
      
      // Cancel payment intent
      try {
        await stripe.paymentIntents.cancel(booking.stripePaymentIntentId!);
        updateData.paymentStatus = 'failed';
      } catch (error) {
        console.error('Failed to cancel payment:', error);
      }
    }
    
    await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId));
    
    // Create notification for guest
    await db.insert(notifications).values({
      userId: booking.guestId,
      type: action === 'approve' ? 'booking_approved' : 'booking_declined',
      title: action === 'approve' ? 'Booking approved!' : 'Booking declined',
      content: action === 'approve' 
        ? 'Your booking request has been approved by the host'
        : 'Unfortunately, your booking request was declined',
      relatedBookingId: booking.id,
      relatedListingId: booking.listingId,
    });
    
    revalidatePath('/bookings');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to respond to booking:', error);
    return { success: false, error: 'Failed to respond to booking' };
  }
}
export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    const db = getDb();
    
    // Get booking details
    const [booking] = await db.select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
      
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }
    
    // Check if user can cancel
    const isHost = booking.hostId === session.user.id;
    const isGuest = booking.guestId === session.user.id;
    
    if (!isHost && !isGuest) {
      return { success: false, error: 'Unauthorized' };
    }
    
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return { success: false, error: 'Booking cannot be cancelled' };
    }
    
    // Update booking
    await db.update(bookings)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));
    
    // Remove availability block if it was approved
    if (booking.status === 'approved') {
      await db.delete(availability)
        .where(
          and(
            eq(availability.listingId, booking.listingId),
            eq(availability.startDate, booking.checkIn),
            eq(availability.endDate, booking.checkOut)
          )
        );
        
      // Process refund if payment was captured
      if (booking.paymentStatus === 'captured' && booking.stripePaymentIntentId) {
        try {
          await stripe.refunds.create({
            payment_intent: booking.stripePaymentIntentId,
          });
        } catch (error) {
          console.error('Failed to process refund:', error);
        }
      }
    }
    
    // Create notification for the other party
    const notifyUserId = isHost ? booking.guestId : booking.hostId;
    await db.insert(notifications).values({
      userId: notifyUserId,
      type: 'booking_cancelled',
      title: 'Booking cancelled',
      content: `The booking has been cancelled by the ${isHost ? 'host' : 'guest'}`,
      relatedBookingId: booking.id,
      relatedListingId: booking.listingId,
    });
    
    revalidatePath('/bookings');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return { success: false, error: 'Failed to cancel booking' };
  }
}