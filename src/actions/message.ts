"use server";

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { messages, notifications } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Message } from '@/types';

interface SendMessageInput {
  bookingId: string;
  recipientId: string;
  content: string;
}

export async function sendMessage(input: SendMessageInput): Promise<ApiResponse<Message>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Verify user is part of the booking
    const booking = await db.query.bookings.findFirst({
      where: (bookings, { and, eq, or }) => 
        and(
          eq(bookings.id, input.bookingId),
          or(
            eq(bookings.guestId, session.user.id),
            eq(bookings.hostId, session.user.id)
          )
        ),
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    // Create message
    const [message] = await db.insert(messages).values({
      id: nanoid(),
      bookingId: input.bookingId,
      senderId: session.user.id,
      recipientId: input.recipientId,
      content: input.content,
    }).returning();

    // Notify recipient
    await db.insert(notifications).values({
      id: nanoid(),
      userId: input.recipientId,
      type: 'message',
      title: 'New Message',
      message: `You have a new message about your booking`,
      data: { bookingId: input.bookingId, messageId: message.id },
    });

    revalidatePath(`/bookings/${input.bookingId}`);

    return { success: true, data: message };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function markMessagesAsRead(bookingId: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Mark all unread messages as read for this user
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.bookingId, bookingId),
          eq(messages.recipientId, session.user.id),
          eq(messages.isRead, false)
        )
      );

    return { success: true };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return { success: false, error: 'Failed to mark messages as read' };
  }
}