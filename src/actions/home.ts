"use server";

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { homes, availability, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import type { CreateHomeInput, ApiResponse, Home } from '@/types';

export async function createHome(input: CreateHomeInput): Promise<ApiResponse<Home>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Update user to host if not already
    await db
      .update(users)
      .set({ isHost: true, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    // Create home
    const [home] = await db.insert(homes).values({
      id: nanoid(),
      hostId: session.user.id,
      ...input,
      amenities: input.amenities,
      images: input.images,
      isActive: true,
      visibilityScore: 100,
    }).returning();

    revalidatePath('/host');
    revalidatePath('/homes');

    return { success: true, data: home };
  } catch (error) {
    console.error('Error creating home:', error);
    return { success: false, error: 'Failed to create home' };
  }
}

export async function updateHome(
  homeId: string,
  input: Partial<CreateHomeInput>
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Verify ownership
    const home = await db.query.homes.findFirst({
      where: (homes, { and, eq }) => 
        and(eq(homes.id, homeId), eq(homes.hostId, session.user.id)),
    });

    if (!home) {
      return { success: false, error: 'Home not found' };
    }

    // Update home
    await db
      .update(homes)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(homes.id, homeId));

    revalidatePath('/host');
    revalidatePath(`/homes/${homeId}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating home:', error);
    return { success: false, error: 'Failed to update home' };
  }
}

export async function toggleHomeStatus(homeId: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Get current home status
    const home = await db.query.homes.findFirst({
      where: (homes, { and, eq }) => 
        and(eq(homes.id, homeId), eq(homes.hostId, session.user.id)),
    });

    if (!home) {
      return { success: false, error: 'Home not found' };
    }

    // Toggle status
    await db
      .update(homes)
      .set({
        isActive: !home.isActive,
        updatedAt: new Date(),
      })
      .where(eq(homes.id, homeId));

    revalidatePath('/host');

    return { success: true };
  } catch (error) {
    console.error('Error toggling home status:', error);
    return { success: false, error: 'Failed to update home status' };
  }
}

export async function addAvailability(
  homeId: string,
  startDate: Date,
  endDate: Date
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Verify ownership
    const home = await db.query.homes.findFirst({
      where: (homes, { and, eq }) => 
        and(eq(homes.id, homeId), eq(homes.hostId, session.user.id)),
    });

    if (!home) {
      return { success: false, error: 'Home not found' };
    }

    // Add availability
    await db.insert(availability).values({
      id: nanoid(),
      homeId,
      startDate,
      endDate,
      isAvailable: true,
    });

    revalidatePath(`/host/${homeId}/availability`);

    return { success: true };
  } catch (error) {
    console.error('Error adding availability:', error);
    return { success: false, error: 'Failed to add availability' };
  }
}

export async function removeAvailability(availabilityId: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Get availability and verify ownership
    const avail = await db.query.availability.findFirst({
      where: eq(availability.id, availabilityId),
      with: {
        home: true,
      },
    });

    if (!avail || avail.home.hostId !== session.user.id) {
      return { success: false, error: 'Availability not found' };
    }

    // Delete availability
    await db.delete(availability).where(eq(availability.id, availabilityId));

    revalidatePath(`/host/${avail.homeId}/availability`);

    return { success: true };
  } catch (error) {
    console.error('Error removing availability:', error);
    return { success: false, error: 'Failed to remove availability' };
  }
}