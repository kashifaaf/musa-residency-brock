import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, users } from "@/lib/db/schema"
import { eq, and, lt, sql } from "drizzle-orm"
import { BOOKING_STATUS, RESPONSE_PENALTY_THRESHOLD } from "@/lib/constants"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    const expiredBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.status, BOOKING_STATUS.PENDING),
          lt(bookings.expiresAt, now)
        )
      )

    for (const booking of expiredBookings) {
      await db
        .update(bookings)
        .set({ status: BOOKING_STATUS.EXPIRED, updatedAt: now })
        .where(eq(bookings.id, booking.id))

      await db
        .update(users)
        .set({
          responsePenalty: sql`${users.responsePenalty} + 1`,
          updatedAt: now,
        })
        .where(eq(users.id, booking.hostId))
    }

    return NextResponse.json({
      success: true,
      expired: expiredBookings.length,
    })
  } catch (error) {
    console.error("Cron expire-bookings error:", error)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}