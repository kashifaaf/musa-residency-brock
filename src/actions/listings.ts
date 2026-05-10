'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { listings, listingPhotos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { CreateListingFormData } from '@/types';

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

interface CreateListingInput extends CreateListingFormData {
  photos: Array<{ url: string; key: string }>;
}

export async function createListing(input: CreateListingInput): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Create the listing
    const [listing] = await db.insert(listings).values({
      hostId: session.user.id,
      title: input.title,
      description: input.description,
      location: input.location,
      address: input.address,
      maxGuests: input.maxGuests,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms.toString(),
      amenities: input.amenities,
      houseRules: input.houseRules,
      creativeFeatures: input.creativeFeatures,
      pricePerNight: input.pricePerNight.toString(),
      currency: input.currency,
      status: 'active',
    }).returning();

    // Add photos if provided
    if (input.photos.length > 0) {
      await db.insert(listingPhotos).values(
        input.photos.map((photo, index) => ({
          listingId: listing.id,
          url: photo.url,
          key: photo.key,
          orderIndex: index,
        }))
      );
    }

    revalidatePath('/listings');
    revalidatePath('/dashboard');

    return { success: true, data: { id: listing.id } };
  } catch (error) {
    console.error('Failed to create listing:', error);
    return { success: false, error: 'Failed to create listing' };
  }
}

export async function updateListingStatus(
  listingId: string, 
  status: 'draft' | 'active' | 'inactive' | 'archived'
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getDb();
    
    // Verify ownership
    const [listing] = await db.select().from(listings)
      .where(eq(listings.id, listingId))
      .limit(1);
      
    if (!listing || listing.hostId !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    await db.update(listings)
      .set({ status, updatedAt: new Date() })
      .where(eq(listings.id, listingId));

    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Failed to update listing status:', error);
    return { success: false, error: 'Failed to update listing status' };
  }
}