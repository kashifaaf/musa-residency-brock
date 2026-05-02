'use server';

import { eq } from 'drizzle-orm';
import { getDb, bookings, homes, homePhotos, users } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ActionResult } from '@/types';

export async function getUserBookings(): Promise<ActionResult<any[]>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const db = getDb();

    const userBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        guests: bookings.guests,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        createdAt: bookings.createdAt,
        expiresAt: bookings.expiresAt,
        home: {
          id: homes.id,
          title: homes.title,
          location: homes.location,
          host: {
            name: users.name,
          },
        },
      })
      .from(bookings)
      .leftJoin(homes, eq(bookings.homeId, homes.id))
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(eq(bookings.guestId, user.id))
      .orderBy(bookings.createdAt);

    return {
      success: true,
      data: userBookings,
    };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return {
      success: false,
      error: 'Failed to fetch bookings',
    };
  }
}

export async function getUserListings(): Promise<ActionResult<any[]>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const db = getDb();

    const userListings = await db
      .select({
        id: homes.id,
        title: homes.title,
        description: homes.description,
        location: homes.location,
        bedrooms: homes.bedrooms,
        bathrooms: homes.bathrooms,
        maxGuests: homes.maxGuests,
        pricePerNight: homes.pricePerNight,
        isActive: homes.isActive,
        createdAt: homes.createdAt,
      })
      .from(homes)
      .where(eq(homes.hostId, user.id))
      .orderBy(homes.createdAt);

    // Get photos for each listing
    const listingsWithPhotos = await Promise.all(
      userListings.map(async (home) => {
        const photos = await db
          .select()
          .from(homePhotos)
          .where(eq(homePhotos.homeId, home.id))
          .orderBy(homePhotos.order)
          .limit(1);

        return {
          ...home,
          photos,
        };
      })
    );

    return {
      success: true,
      data: listingsWithPhotos,
    };
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return {
      success: false,
      error: 'Failed to fetch listings',
    };
  }
}