"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/types"

interface ProfileData {
  name: string
  bio: string
  location: string
  workInfo: string
  socialMediaUrl: string
}

export async function updateProfile(data: ProfileData): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to update your profile" }
    }

    const { name, bio, location, workInfo, socialMediaUrl } = data

    if (!name.trim()) {
      return { success: false, error: "Name is required" }
    }

    // Validate URL if provided
    if (socialMediaUrl && socialMediaUrl.trim()) {
      try {
        new URL(socialMediaUrl)
      } catch {
        return { success: false, error: "Please enter a valid URL for social media" }
      }
    }

    await db
      .update(users)
      .set({
        name: name.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        workInfo: workInfo.trim() || null,
        socialMediaUrl: socialMediaUrl.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath("/profile")

    return { success: true, data: { success: true } }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}