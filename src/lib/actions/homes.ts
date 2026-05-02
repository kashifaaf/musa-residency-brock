'use server';

import { eq } from 'drizzle-orm';
import { getDb, homes, homePhotos, users } from '@/lib/db';
import { ActionResult } from '@/types';

export async function getHomeDetails(homeId: string): Promise<ActionResult<any>> {
  try {
    const db = getDb();
    
    // Get home with host info
    const homeResult = await db
      .select({
        id: homes.id,
        title: homes.title,
        description: homes.description,
        location: homes.location,
        address: homes.address,
        bedrooms: homes.bedrooms,
        bathrooms: homes.bathrooms,
        maxGuests: homes.maxGuests,
        pricePerNight: homes.pricePerNight,
        amenities: homes.amenities,
        houseRules: homes.houseRules,
        isActive: homes.isActive,
        hostId: homes.hostId,
        host: {
          id: users.id,
          name: users.name,
          photoUrl: users.photoUrl,
          bio: users.bio,
          location: users.location,
        },
      })
      .from(homes)
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(eq(homes.id, homeId))
      .limit(1);

    if (homeResult.length === 0) {
      return {
        success: false,
        error: 'Home not found',
      };
    }

    // Get photos
    const photos = await db
      .select()
      .from(homePhotos)
      .where(eq(homePhotos.homeId, homeId))
      .orderBy(homePhotos.order);

    const home = {
      ...homeResult[0],
      photos,
    };

    return {
      success: true,
      data: home,
    };
  } catch (error) {
    console.error('Error fetching home details:', error);
    return {
      success: false,
      error: 'Failed to fetch home details',
    };
  }
}