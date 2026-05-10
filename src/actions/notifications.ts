'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const db = getDb();

  await db
    .update(notifications)
    .set({ 
      read: true,
      updatedAt: new Date() 
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, session.user.id)
      )
    );

  revalidatePath('/dashboard');
}

export async function markAllNotificationsAsRead() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const db = getDb();

  await db
    .update(notifications)
    .set({ 
      read: true,
      updatedAt: new Date() 
    })
    .where(eq(notifications.userId, session.user.id));

  revalidatePath('/dashboard');
}