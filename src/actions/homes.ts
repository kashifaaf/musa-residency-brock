"use server";

import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { homes } from "@/lib/db/schema";
import { generateIdFromEntropySize } from "lucia";
import type { ActionResponse } from "@/types";

export async function createHome(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const homeType = formData.get("homeType") as string;
    const bedrooms = parseInt(formData.get("bedrooms") as string);
    const bathrooms = parseFloat(formData.get("bathrooms") as string);
    const maxGuests = parseInt(formData.get("maxGuests") as string);
    const houseRules = formData.get("houseRules") as string;
    const localArtScene = formData.get("localArtScene") as string;

    const amenities = formData.getAll("amenities") as string[];
    const creativeAmenities = formData.getAll("creativeAmenities") as string[];

    if (!title || !description || !location || !country || !city || !homeType) {
      return { success: false, error: "Required fields missing" };
    }

    const db = getDb();
    const homeId = generateIdFromEntropySize(10);

    await db.insert(homes).values({
      id: homeId,
      userId: user.id,
      title,
      description,
      location,
      country,
      city,
      address: address || null,
      homeType,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      creativeAmenities,
      houseRules: houseRules || null,
      localArtScene: localArtScene || null,
      isPublished: true, // For MVP, publish immediately
    });

    return { success: true, data: { id: homeId } };
  } catch (error) {
    console.error("CreateHome error:", error);
    return { success: false, error: "Failed to create home" };
  }
}