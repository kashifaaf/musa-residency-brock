"use server"

import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  bio: z.string().optional(),
  workInfo: z.string().optional(),
  isArtist: z.boolean().optional(),
  medium: z.string().optional(),
  portfolio: z.string().url().optional().or(z.literal("")),
  artistStatement: z.string().optional(),
  experience: z.string().optional(),
})

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const data = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      bio: formData.get("bio") as string,
      workInfo: formData.get("workInfo") as string,
      isArtist: formData.get("isArtist") === "on",
      medium: formData.get("medium") as string,
      portfolio: formData.get("portfolio") as string,
      artistStatement: formData.get("artistStatement") as string,
      experience: formData.get("experience") as string,
    }

    const result = profileSchema.safeParse(data)
    if (!result.success) {
      return { success: false, error: result.error.errors[0].message }
    }

    const { name, location, bio, workInfo, isArtist, medium, portfolio, artistStatement, experience } = result.data

    const artistInfo: any = {}
    if (isArtist) {
      if (medium) artistInfo.medium = medium.split(",").map(m => m.trim()).filter(Boolean)
      if (portfolio) artistInfo.portfolio = portfolio
      if (artistStatement) artistInfo.statement = artistStatement
      if (experience) artistInfo.experience = experience
    }

    const db = getDb()
    await db
      .update(users)
      .set({
        name,
        location: location || null,
        bio: bio || null,
        workInfo: workInfo || null,
        isArtist: isArtist || false,
        artistInfo: Object.keys(artistInfo).length > 0 ? artistInfo : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    return { success: true, data: "Profile updated successfully" }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}