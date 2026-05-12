"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { profileSchema } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProfile(
  userId: string,
  data: z.infer<typeof profileSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = profileSchema.parse(data);
    const db = getDb();

    await db
      .update(users)
      .set({
        name: validated.name,
        bio: validated.bio,
        location: validated.location,
        workInfo: validated.workInfo,
        socialLinks: validated.socialLinks,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function switchToHost(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const db = getDb();

    // Get current user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      return { success: false, error: "User not found" };
    }

    // Update role
    const newRole = user[0].role === "guest" ? "both" : user[0].role;
    
    await db
      .update(users)
      .set({
        role: newRole,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Switch to host error:", error);
    return { success: false, error: "Failed to switch role" };
  }
}