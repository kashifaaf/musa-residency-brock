"use server";

import { getDb } from '@/lib/db';
import { homes, homePhotos, homeAvailability, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth/config';
import { eq, and, gte, lte, or, not, exists, inArray, ilike } from 'drizzle-orm';
import { bookingRequests } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function createHome(
  title: string,
  description: string,
  location: string,
  pricePerNight: number,
  maxGuests: number
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    const [home] = await db
      .insert(homes)
      .values({
        hostId: session.user.id,
        title,
        description,
        location,
        pricePerNight: pricePerNight.toString(),
        maxGuests,
      })
      .returning({ id: homes.id });

    revalidatePath('/homes');
    return { success: true, data: { id: home.id } };
  } catch (error) {
    return { success: false, error: 'Failed to create home listing' };
  }
}

export async function addHomePhotos(
  homeId: string,
  photoUrls: string[]
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    
    // Verify ownership
    const [home] = await db
      .select()
      .from(homes)
      .where(and(eq(homes.id, homeId), eq(homes.hostId, session.user.id)))
      .limit(1);

    if (!home) {
      return { success: false, error: 'Home not found or unauthorized' };
    }

    // Insert photos
    const photoData = photoUrls.map((url, index) => ({
      homeId,
      url,
      sortOrder: index,
    }));

    await db.insert(homePhotos).values(photoData);

    revalidatePath(`/homes/${homeId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Failed to add photos' };
  }
}

export async function setHomeAvailability(
  homeId: string,
  availability: Array<{ startDate: Date; endDate: Date }>
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    const db = getDb();
    
    // Verify ownership
    const [home] = await db
      .select()
      .from(homes)
      .where(and(eq(homes.id, homeId), eq(homes.hostId, session.user.id)))
      .limit(1);

    if (!home) {
      return { success: false, error: 'Home not found or unauthorized' };
    }

    // Clear existing availability
    await db
      .delete(homeAvailability)
      .where(eq(homeAvailability.homeId, homeId));

    // Insert new availability
    if (availability.length > 0) {
      await db.insert(homeAvailability).values(
        availability.map(({ startDate, endDate }) => ({
          homeId,
          startDate,
          endDate,
        }))
      );
    }

    revalidatePath(`/homes/${homeId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Failed to update availability' };
  }
}

export async function searchHomes(
  location?: string,
  startDate?: Date,
  endDate?: Date
): Promise<ActionResult<Array<{
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: string;
  maxGuests: number;
  photos: Array<{ url: string }>;
  hostName: string;
}>>> {
  try {
    const db = getDb();
    
    let query = db
      .select({
        id: homes.id,
        title: homes.title,
        description: homes.description,
        location: homes.location,
        pricePerNight: homes.pricePerNight,
        maxGuests: homes.maxGuests,
        hostName: homes.hostId, // We'll join this properly
      })
      .from(homes)
      .where(eq(homes.isActive, true));

    // Filter by location if provided
    if (location) {
      query = query.where(
        and(
          eq(homes.isActive, true),
          or(
            ilike(homes.location, `%${location}%`),
            ilike(homes.title, `%${location}%`)
          )
        )
      );
    }

    // Filter by date availability if provided
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(homes.isActive, true),
          exists(
            db
              .select()
              .from(homeAvailability)
              .where(
                and(
                  eq(homeAvailability.homeId, homes.id),
                  lte(homeAvailability.startDate, startDate),
                  gte(homeAvailability.endDate, endDate)
                )
              )
          ),
          not(
            exists(
              db
                .select()
                .from(bookingRequests)
                .where(
                  and(
                    eq(bookingRequests.homeId, homes.id),
                    eq(bookingRequests.status, 'approved'),
                    or(
                      and(
                        lte(bookingRequests.startDate, startDate),
                        gte(bookingRequests.endDate, startDate)
                      ),
                      and(
                        lte(bookingRequests.startDate, endDate),
                        gte(bookingRequests.endDate, endDate)
                      ),
                      and(
                        gte(bookingRequests.startDate, startDate),
                        lte(bookingRequests.endDate, endDate)
                      )
                    )
                  )
                )
            )
          )
        )
      );
    }

    const homesResult = await query.limit(50);

    // Get photos for each home
    const homeIds = homesResult.map(h => h.id);
    const photos = homeIds.length > 0 ? await db
      .select({
        homeId: homePhotos.homeId,
        url: homePhotos.url,
      })
      .from(homePhotos)
      .where(inArray(homePhotos.homeId, homeIds))
      .orderBy(homePhotos.sortOrder) : [];

    // Get host names
    const hostIds = homesResult.map(h => h.hostName);
    const hosts = hostIds.length > 0 ? await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(inArray(users.id, hostIds)) : [];

    // Combine results
    const results = homesResult.map(home => ({
      ...home,
      hostName: hosts.find(h => h.id === home.hostName)?.name || 'Unknown',
      photos: photos.filter(p => p.homeId === home.id),
    }));

    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: 'Failed to search homes' };
  }
}