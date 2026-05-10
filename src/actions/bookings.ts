"use server";

import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { bookingRequests, homes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { addDays } from "@/lib/utils";
import { BOOKING_REQUEST_EXPIRY_HOURS } from "@/lib/constants";
import { BookingStatus, type ActionResponse } from "@/types";

export async function createBookingRequest(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const homeId = formData.get("homeId") as string;
    const hostId = formData.get("hostId") as string;
    const checkIn = new Date(formData.get("checkIn") as string);
    const checkOut = new Date(formData.get("checkOut") as string);
    const guests = parseInt(formData.get("guests") as string);
    const totalPrice = parseFloat(formData.get("totalPrice") as string);
    const message = formData.get("message") as string;

    if (!homeId || !hostId || !checkIn || !checkOut || !guests || !totalPrice) {
      return { success: false, error: "Missing required fields" };
    }

    const db = getDb();
    const bookingId = generateIdFromEntropySize(10);
    const requestExpiresAt = addDays(new Date(), BOOKING_REQUEST_EXPIRY_HOURS / 24);

    await db.insert(bookingRequests).values({
      id: bookingId,
      homeId,
      guestId: user.id,
      hostId,
      checkIn,
      checkOut,
      guests,
      totalPrice: totalPrice.toString(),
      message: message || null,
      status: BookingStatus.PENDING,
      requestExpiresAt,
    });

    // TODO: Send email notification to host

    return { success: true, data: { id: bookingId } };
  } catch (error) {
    console.error("CreateBookingRequest error:", error);
    return { success: false, error: "Failed to create booking request" };
  }
}

export async function approveBooking(bookingId: string): Promise<ActionResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();
    
    // Verify user is the host
    const booking = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return { success: false, error: "Booking not found" };
    }

    if (booking[0].hostId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (booking[0].status !== BookingStatus.PENDING) {
      return { success: false, error: "Booking is no longer pending" };
    }

    if (new Date(booking[0].requestExpiresAt) < new Date()) {
      return { success: false, error: "Booking request has expired" };
    }

    // Update booking status
    await db
      .update(bookingRequests)
      .set({
        status: BookingStatus.APPROVED,
        hostRespondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, bookingId));

    // TODO: Process payment
    // TODO: Send email notification to guest

    return { success: true, data: undefined };
  } catch (error) {
    console.error("ApproveBooking error:", error);
    return { success: false, error: "Failed to approve booking" };
  }
}

export async function declineBooking(bookingId: string): Promise<ActionResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();
    
    // Verify user is the host
    const booking = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return { success: false, error: "Booking not found" };
    }

    if (booking[0].hostId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (booking[0].status !== BookingStatus.PENDING) {
      return { success: false, error: "Booking is no longer pending" };
    }

    // Update booking status
    await db
      .update(bookingRequests)
      .set({
        status: BookingStatus.DECLINED,
        hostRespondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookingRequests.id, bookingId));

    // TODO: Send email notification to guest

    return { success: true, data: undefined };
  } catch (error) {
    console.error("DeclineBooking error:", error);
    return { success: false, error: "Failed to decline booking" };
  }
}