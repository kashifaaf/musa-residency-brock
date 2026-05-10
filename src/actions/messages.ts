"use server";

import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { messages, bookingRequests, users } from "@/lib/db/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import type { ActionResponse, MessageWithUsers } from "@/types";

export async function sendMessage(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const bookingRequestId = formData.get("bookingRequestId") as string;
    const recipientId = formData.get("recipientId") as string;
    const content = formData.get("content") as string;

    if (!recipientId || !content) {
      return { success: false, error: "Missing required fields" };
    }

    const db = getDb();

    // If bookingRequestId is provided, verify user is involved
    if (bookingRequestId) {
      const booking = await db
        .select()
        .from(bookingRequests)
        .where(eq(bookingRequests.id, bookingRequestId))
        .limit(1);

      if (booking.length === 0) {
        return { success: false, error: "Booking not found" };
      }

      if (booking[0].hostId !== user.id && booking[0].guestId !== user.id) {
        return { success: false, error: "Unauthorized" };
      }
    }

    const messageId = generateIdFromEntropySize(10);

    await db.insert(messages).values({
      id: messageId,
      bookingRequestId: bookingRequestId || null,
      senderId: user.id,
      recipientId,
      content,
    });

    return { success: true, data: { id: messageId } };
  } catch (error) {
    console.error("SendMessage error:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getMessages(bookingRequestId: string): Promise<ActionResponse<MessageWithUsers[]>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Verify user is involved in the booking
    const booking = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, bookingRequestId))
      .limit(1);

    if (booking.length === 0) {
      return { success: false, error: "Booking not found" };
    }

    if (booking[0].hostId !== user.id && booking[0].guestId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get messages with user details
    const messageData = await db
      .select({
        message: messages,
        sender: users,
        recipient: users,
      })
      .from(messages)
      .leftJoin(users, eq(users.id, messages.senderId))
      .leftJoin(users, eq(users.id, messages.recipientId))
      .where(eq(messages.bookingRequestId, bookingRequestId))
      .orderBy(messages.createdAt);

    const messagesWithUsers: MessageWithUsers[] = messageData
      .filter((row) => row.sender && row.recipient)
      .map((row) => ({
        ...row.message,
        sender: row.sender!,
        recipient: row.recipient!,
      }));

    // Mark messages as read
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.bookingRequestId, bookingRequestId),
          eq(messages.recipientId, user.id)
        )
      );

    return { success: true, data: messagesWithUsers };
  } catch (error) {
    console.error("GetMessages error:", error);
    return { success: false, error: "Failed to get messages" };
  }
}