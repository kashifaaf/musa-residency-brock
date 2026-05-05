import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { getDb } from '@/lib/db';
import { homes } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const {
      title,
      description,
      location,
      pricePerNight,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      photos,
    } = await request.json();

    if (!title || !description || !location || !pricePerNight || !bedrooms || !bathrooms || !maxGuests) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDb();

    const newHome = await db
      .insert(homes)
      .values({
        hostId: session.userId,
        title,
        description,
        location,
        pricePerNight: pricePerNight.toString(),
        bedrooms,
        bathrooms,
        maxGuests,
        amenities: amenities || [],
        photos: photos || [],
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: { home: newHome[0] },
    });
  } catch (error) {
    console.error('Create home error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}