"use server"

import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(1).max(255),
  bio: z.string().max(2000).optional(),
  location: z.string().max(255).optional(),
  occupation: z.string().max(255).optional(),
  socialLinks: z.string().optional(),
  phone: z.string().max(50).optional(),
  image: z.string().url().optional(),
})

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function updateProfile(
  formData: z.infer<typeof profileSchema>
): Promise<ActionResult<null>> {
  try {
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" }
    }

    const parsed = profileSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid data" }
    }

    const data = parsed.data

    await db
      .update(users)
      .set({
        name: data.name,
        bio: data.bio || null,
        location: data.location || null,
        occupation: data.occupation || null,
        socialLinks: data.socialLinks || null,
        phone: data.phone || null,
        image: data.image || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return { success: true, data: null }
  } catch (error) {
    console.error("updateProfile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}