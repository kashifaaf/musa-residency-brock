import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { messages, bookings, users } from "@/lib/db/schema"
import { eq, and, or } from "drizzle-orm"
import { z } from "zod"

const messageSchema = z.object({
  content: z.string().min(1).max(5000),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const session = await getServerSession(getAuthOptions())
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const booking = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.id, bookingId),
        or(
          eq(bookings.guestId, session.user.id),
          eq(bookings.hostId, session.user.id)
        )
      ),
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = messageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      )
    }

    const [message] = await db
      .insert(messages)
      .values({
        bookingId,
        senderId: session.user.id,
        content: parsed.data.content,
      })
      .returning()

    const sender = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { id: true, name: true, image: true },
    })

    return NextResponse.json({
      success: true,
      data: { ...message, sender },
    })
  } catch (error) {
    console.error("POST /api/bookings/[id]/messages error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    )
  }
}