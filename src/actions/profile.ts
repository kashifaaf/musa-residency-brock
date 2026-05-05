"use server"

import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ActionResult } from "@/types"

export async function updateProfile(formData: FormData): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const bio = formData.get("bio") as string
    const workInfo = formData.get("workInfo") as string
    const socialMedia = formData.get("socialMedia") as string

    const db = getDb()
    
    await db
      .update(users)
      .set({
        name: name || null,
        location: location || null,
        bio: bio || null,
        workInfo: workInfo || null,
        socialMedia: socialMedia || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    return { success: true, data: { success: true } }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}