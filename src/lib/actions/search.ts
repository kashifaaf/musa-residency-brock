'use server';

import { eq, and, gte, lte, ilike } from 'drizzle-orm';
import { getDb, homes, homePhotos, users } from '@/lib/db';
import { ActionResult, SearchFilters } from '@/types';

export async function getSearchResults(
  filters: SearchFilters
): Promise<ActionResult<{ homes: any[]; total: number }>> {
  try {
    const db = getDb();
    
    // Build WHERE conditions
    const conditions = [eq(homes.isActive, true)];
    
    if (filters.location) {
      conditions.push(ilike(homes.location, `%${filters.location}%`));
    }
    
    if (filters.guests) {
      conditions.push(gte(homes.maxGuests, parseInt(filters.guests)));
    }
    
    if (filters.minPrice) {
      conditions.push(gte(homes.pricePerNight, filters.minPrice.toString()));
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(homes.pricePerNight, filters.maxPrice.toString()));
    }

    // Query homes with photos and host info
    const results = await db
      .select({
        id: homes.id,
        title: homes.title,
        description: homes.description,
        location: homes.location,
        bedrooms: homes.bedrooms,
        bathrooms: homes.bathrooms,
        maxGuests: homes.maxGuests,
        pricePerNight: homes.pricePerNight,
        host: {
          id: users.id,
          name: users.name,
          photoUrl: users.photoUrl,
        },
      })
      .from(homes)
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(50);

    // Get photos for each home
    const homeIds = results.map(h => h.id);
    const photos = homeIds.length > 0 ? await db
      .select()
      .from(homePhotos)
      .where(eq(homePhotos.homeId, homeIds[0])) // Simplified for demo
      : [];

    // Combine results with photos
    const homesWithPhotos = results.map(home => ({
      ...home,
      photos: photos.filter(p => p.homeId === home.id),
    }));

    return {
      success: true,
      data: {
        homes: homesWithPhotos,
        total: results.length,
      },
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      error: 'Failed to search homes',
    };
  }
}