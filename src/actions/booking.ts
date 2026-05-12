"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { bookings, listings, payments } from "@/lib/db/schema";
import { bookingRequestSchema } from "@/types";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function createBookingRequest(
  data: z.infer<typeof bookingRequestSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to book" };
    }

    const validated = bookingRequestSchema.parse(data);
    const db = getDb();

    // Get listing details
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, validated.listingId))
      .limit(1);

    if (!listing[0]) {
      return { success: false, error: "Listing not found" };
    }

    if (listing[0].hostId === session.user.id) {
      return { success: false, error: "You cannot book your own listing" };
    }

    // Calculate total price
    const nights = Math.ceil(
      (validated.checkOut.getTime() - validated.checkIn.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * Number(listing[0].pricePerNight);

    // Create booking
    const bookingId = nanoid();
    
    await db.insert(bookings).values({
      id: bookingId,
      listingId: validated.listingId,
      guestId: session.user.id,
      hostId: listing[0].hostId,
      checkIn: validated.checkIn,
      checkOut: validated.checkOut,
      guestCount: validated.guestCount,
      totalPrice: totalPrice.toString(),
      guestMessage: validated.guestMessage,
      status: "pending",
    });

    revalidatePath("/dashboard");
    return { success: true, data: { bookingId } };
  } catch (error) {
    console.error("Create booking error:", error);
    return { success: false, error: "Failed to create booking request" };
  }
}

export async function approveBooking(bookingId: string, hostMessage?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Verify booking belongs to host
    const booking = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.hostId, session.user.id),
        eq(bookings.status, "pending")
      ))
      .limit(1);

    if (!booking[0]) {
      return { success: false, error: "Booking not found or already processed" };
    }

    // Update booking
    await db
      .update(bookings)
      .set({
        status: "approved",
        hostMessage,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Approve booking error:", error);
    return { success: false, error: "Failed to approve booking" };
  }
}

export async function declineBooking(bookingId: string, hostMessage: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Verify booking belongs to host
    const booking = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.hostId, session.user.id),
        eq(bookings.status, "pending")
      ))
      .limit(1);

    if (!booking[0]) {
      return { success: false, error: "Booking not found or already processed" };
    }

    // Update booking
    await db
      .update(bookings)
      .set({
        status: "declined",
        hostMessage,
        declinedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Decline booking error:", error);
    return { success: false, error: "Failed to decline booking" };
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Verify booking belongs to guest and is pending
    const booking = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.guestId, session.user.id),
        eq(bookings.status, "pending")
      ))
      .limit(1);

    if (!booking[0]) {
      return { success: false, error: "Booking not found or cannot be cancelled" };
    }

    // Update booking
    await db
      .update(bookings)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Cancel booking error:", error);
    return { success: false, error: "Failed to cancel booking" };
  }
}