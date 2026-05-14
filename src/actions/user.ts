"use server";

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { UpdateUserProfileInput, ApiResponse } from '@/types';

export async function updateProfile(input: UpdateUserProfileInput): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Update user profile
    await db
      .update(users)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function becomeHost(): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Check if user has completed profile
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user?.name || !user?.bio || !user?.location) {
      return { success: false, error: 'Please complete your profile before becoming a host' };
    }

    // Update host status
    await db
      .update(users)
      .set({
        isHost: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error becoming host:', error);
    return { success: false, error: 'Failed to update host status' };
  }
}