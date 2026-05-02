'use server';

import { revalidatePath } from 'next/cache';
import { getDb, homes } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ActionResult } from '@/types';

interface CreateListingData {
  title: string;
  description: string;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  amenities: string[];
  houseRules?: string;
}

export async function createListing(data: CreateListingData): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'You must be signed in to create a listing',
      };
    }

    const db = getDb();

    const listingData = {
      hostId: user.id,
      title: data.title,
      description: data.description,
      location: data.location,
      address: data.address,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      maxGuests: data.maxGuests,
      pricePerNight: data.pricePerNight.toString(),
      amenities: JSON.stringify(data.amenities),
      houseRules: data.houseRules || null,
      isActive: true,
    };

    const newListing = await db.insert(homes).values(listingData).returning({ id: homes.id });

    revalidatePath('/dashboard');
    revalidatePath('/search');

    return {
      success: true,
      data: { id: newListing[0].id },
    };
  } catch (error) {
    console.error('Error creating listing:', error);
    return {
      success: false,
      error: 'Failed to create listing',
    };
  }
}