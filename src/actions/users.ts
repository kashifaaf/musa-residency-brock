'use server'

import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import type { ActionResult } from '@/actions/bookings'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  workInfo: z.string().max(500).optional(),
  artisticPractice: z.string().max(500).optional(),
  socialMediaUrls: z.object({
    website: z.string().url().optional().or(z.literal('')),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
})

export async function updateUserToHost(): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in' }
    }

    const db = getDb()
    
    await db.update(users)
      .set({ 
        isHost: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id))

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Update user to host error:', error)
    return { success: false, error: 'Failed to update account' }
  }
}

export async function updateProfile(
  data: z.infer<typeof updateProfileSchema>
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in' }
    }

    const validatedData = updateProfileSchema.parse(data)
    
    const db = getDb()
    
    await db.update(users)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id))

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Update profile error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid profile data' }
    }
    return { success: false, error: 'Failed to update profile' }
  }
}