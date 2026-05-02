'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ActionResult } from '@/lib/types';

interface ProfileData {
  name: string;
  bio: string;
  location: string;
  workInfo: string;
  socialMedia: string;
  profilePhoto: string;
}

export async function updateProfile(data: ProfileData): Promise<ActionResult<void>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const db = getDb();
    await db
      .update(users)
      .set({
        name: data.name,
        bio: data.bio,
        location: data.location,
        workInfo: data.workInfo,
        socialMedia: data.socialMedia,
        profilePhoto: data.profilePhoto,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email));

    revalidatePath('/profile');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}