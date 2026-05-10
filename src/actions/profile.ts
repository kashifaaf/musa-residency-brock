"use server";

import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResponse } from "@/types";

export async function updateProfile(formData: FormData): Promise<ActionResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const workInfo = formData.get("workInfo") as string;
    const isArtist = formData.get("isArtist") === "true";
    const artistType = formData.get("artistType") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;
    
    const instagram = formData.get("instagram") as string;
    const website = formData.get("website") as string;
    const linkedin = formData.get("linkedin") as string;

    const socialMedia = {
      instagram: instagram || undefined,
      website: website || undefined,
      linkedin: linkedin || undefined,
    };

    const db = getDb();

    await db
      .update(users)
      .set({
        name: name || null,
        bio: bio || null,
        location: location || null,
        workInfo: workInfo || null,
        isArtist,
        artistType: artistType || null,
        portfolioUrl: portfolioUrl || null,
        socialMedia,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: true, data: undefined };
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}