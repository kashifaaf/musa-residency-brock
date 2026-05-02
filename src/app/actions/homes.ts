'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { homes, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ActionResult } from '@/lib/types';

interface HomeData {
  title: string;
  description: string;
  location: string;
  maxGuests: number;
  amenities: string[];
  photos: string[];
}

export async function createHome(data: HomeData): Promise<ActionResult<string>> {
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

    const [home] = await db
      .insert(homes)
      .values({
        hostId: user.id,
        title: data.title,
        description: data.description,
        location: data.location,
        maxGuests: data.maxGuests,
        amenities: JSON.stringify(data.amenities),
        photos: JSON.stringify(data.photos),
      })
      .returning({ id: homes.id });

    revalidatePath('/host/homes');
    return { success: true, data: home.id };
  } catch (error) {
    console.error('Create home error:', error);
    return { success: false, error: 'Failed to create home listing' };
  }
}