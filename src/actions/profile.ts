"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

const profileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  workInfo: z.string().max(500).optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      website: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
})

export async function updateProfile(
  formData: z.infer<typeof profileSchema>
): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in" }
    }

    const parsed = profileSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    await db
      .update(users)
      .set({
        name: parsed.data.name,
        bio: parsed.data.bio || null,
        location: parsed.data.location || null,
        workInfo: parsed.data.workInfo || null,
        socialLinks: parsed.data.socialLinks || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath("/profile")
    revalidatePath("/profile/edit")
    return { success: true, data: null }
  } catch (error) {
    console.error("updateProfile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}