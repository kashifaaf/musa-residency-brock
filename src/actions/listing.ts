"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { listingSchema } from "@/types";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function createListing(
  hostId: string,
  data: z.infer<typeof listingSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== hostId) {
      return { success: false, error: "Unauthorized" };
    }

    if (session.user.role === "guest") {
      return { success: false, error: "You must be a host to create listings" };
    }

    const validated = listingSchema.parse(data);
    const db = getDb();

    const listingId = nanoid();

    await db.insert(listings).values({
      id: listingId,
      hostId,
      title: validated.title,
      description: validated.description,
      address: validated.address,
      city: validated.city,
      country: validated.country,
      propertyType: validated.propertyType,
      maxGuests: validated.maxGuests,
      bedrooms: validated.bedrooms,
      bathrooms: validated.bathrooms.toString(),
      amenities: validated.amenities,
      creativeAmenities: validated.creativeAmenities,
      houseRules: validated.houseRules,
      neighborhoodDescription: validated.neighborhoodDescription,
      pricePerNight: validated.pricePerNight.toString(),
      minimumStay: validated.minimumStay,
      status: "draft",
    });

    revalidatePath("/dashboard");
    return { success: true, data: { listingId } };
  } catch (error) {
    console.error("Create listing error:", error);
    return { success: false, error: "Failed to create listing" };
  }
}

export async function updateListing(
  listingId: string,
  data: z.infer<typeof listingSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = listingSchema.parse(data);
    const db = getDb();

    // Verify listing belongs to user
    const listing = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.id, listingId),
        eq(listings.hostId, session.user.id)
      ))
      .limit(1);

    if (!listing[0]) {
      return { success: false, error: "Listing not found" };
    }

    await db
      .update(listings)
      .set({
        title: validated.title,
        description: validated.description,
        address: validated.address,
        city: validated.city,
        country: validated.country,
        propertyType: validated.propertyType,
        maxGuests: validated.maxGuests,
        bedrooms: validated.bedrooms,
        bathrooms: validated.bathrooms.toString(),
        amenities: validated.amenities,
        creativeAmenities: validated.creativeAmenities,
        houseRules: validated.houseRules,
        neighborhoodDescription: validated.neighborhoodDescription,
        pricePerNight: validated.pricePerNight.toString(),
        minimumStay: validated.minimumStay,
        updatedAt: new Date(),
      })
      .where(eq(listings.id, listingId));

    revalidatePath("/dashboard");
    revalidatePath(`/listings/${listingId}`);
    revalidatePath(`/host/listings/${listingId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Update listing error:", error);
    return { success: false, error: "Failed to update listing" };
  }
}

export async function publishListing(listingId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Verify listing belongs to user
    const listing = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.id, listingId),
        eq(listings.hostId, session.user.id)
      ))
      .limit(1);

    if (!listing[0]) {
      return { success: false, error: "Listing not found" };
    }

    await db
      .update(listings)
      .set({
        status: "published",
        updatedAt: new Date(),
      })
      .where(eq(listings.id, listingId));

    revalidatePath("/dashboard");
    revalidatePath("/listings");
    return { success: true };
  } catch (error) {
    console.error("Publish listing error:", error);
    return { success: false, error: "Failed to publish listing" };
  }
}

export async function pauseListing(listingId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Verify listing belongs to user
    const listing = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.id, listingId),
        eq(listings.hostId, session.user.id)
      ))
      .limit(1);

    if (!listing[0]) {
      return { success: false, error: "Listing not found" };
    }

    await db
      .update(listings)
      .set({
        status: "paused",
        updatedAt: new Date(),
      })
      .where(eq(listings.id, listingId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Pause listing error:", error);
    return { success: false, error: "Failed to pause listing" };
  }
}