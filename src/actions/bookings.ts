'use server'

import { getDb } from '@/lib/db'
import { bookings, homes } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq, and, or, gte, lte } from 'drizzle-orm'
import { z } from 'zod'
import type { BookingRequest } from '@/types'

const createBookingSchema = z.object({
  homeId: z.string().uuid(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(10),
  message: z.string().optional(),
})

export type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

export async function createBookingRequest(
  request: BookingRequest
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in to book' }
    }

    const validatedData = createBookingSchema.parse(request)
    
    const db = getDb()
    
    // Check if home exists and is active
    const home = await db.query.homes.findFirst({
      where: and(
        eq(homes.id, validatedData.homeId),
        eq(homes.isActive, true)
      )
    })

    if (!home) {
      return { success: false, error: 'Home not found or unavailable' }
    }

    // Check if user is trying to book their own home
    if (home.hostId === session.user.id) {
      return { success: false, error: 'You cannot book your own home' }
    }

    // Parse dates
    const checkIn = new Date(validatedData.checkIn)
    const checkOut = new Date(validatedData.checkOut)
    
    // Validate dates
    if (checkIn >= checkOut) {
      return { success: false, error: 'Check-out must be after check-in' }
    }

    if (checkIn < new Date()) {
      return { success: false, error: 'Check-in date must be in the future' }
    }

    // Calculate nights and validate minimum stay
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    if (nights < home.minimumStay) {
      return { success: false, error: `Minimum stay is ${home.minimumStay} nights` }
    }

    // Check for existing bookings that overlap
    const overlappingBookings = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.homeId, validatedData.homeId),
        or(
          eq(bookings.status, 'pending'),
          eq(bookings.status, 'approved')
        ),
        or(
          and(
            lte(bookings.checkIn, checkIn),
            gte(bookings.checkOut, checkIn)
          ),
          and(
            lte(bookings.checkIn, checkOut),
            gte(bookings.checkOut, checkOut)
          ),
          and(
            gte(bookings.checkIn, checkIn),
            lte(bookings.checkOut, checkOut)
          )
        )
      )
    })

    if (overlappingBookings) {
      return { success: false, error: 'These dates are not available' }
    }

    // Calculate total price
    const totalPrice = (nights * parseFloat(home.pricePerNight)).toFixed(2)

    // Create booking
    const [booking] = await db.insert(bookings).values({
      homeId: validatedData.homeId,
      guestId: session.user.id,
      checkIn,
      checkOut,
      guests: validatedData.guests,
      totalPrice,
      message: validatedData.message,
      status: 'pending',
      paymentStatus: 'pending',
    }).returning()

    if (!booking) {
      return { success: false, error: 'Failed to create booking' }
    }

    return { success: true, data: { id: booking.id } }
  } catch (error) {
    console.error('Create booking error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid booking data' }
    }
    return { success: false, error: 'Failed to create booking request' }
  }
}

export async function approveBooking(bookingId: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in' }
    }

    const db = getDb()
    
    // Get booking with home details
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        home: true
      }
    })

    if (!booking) {
      return { success: false, error: 'Booking not found' }
    }

    // Check if user is the host
    if (booking.home.hostId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if booking is still pending
    if (booking.status !== 'pending') {
      return { success: false, error: 'Booking is no longer pending' }
    }

    // Update booking status
    await db.update(bookings)
      .set({ 
        status: 'approved',
        hostResponseAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId))

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Approve booking error:', error)
    return { success: false, error: 'Failed to approve booking' }
  }
}

export async function declineBooking(bookingId: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in' }
    }

    const db = getDb()
    
    // Get booking with home details
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        home: true
      }
    })

    if (!booking) {
      return { success: false, error: 'Booking not found' }
    }

    // Check if user is the host
    if (booking.home.hostId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if booking is still pending
    if (booking.status !== 'pending') {
      return { success: false, error: 'Booking is no longer pending' }
    }

    // Update booking status
    await db.update(bookings)
      .set({ 
        status: 'declined',
        hostResponseAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId))

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Decline booking error:', error)
    return { success: false, error: 'Failed to decline booking' }
  }
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in' }
    }

    const db = getDb()
    
    // Get booking
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: {
        home: true
      }
    })

    if (!booking) {
      return { success: false, error: 'Booking not found' }
    }

    // Check if user is either the guest or host
    if (booking.guestId !== session.user.id && booking.home.hostId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return { success: false, error: 'Booking cannot be cancelled' }
    }

    // Update booking status
    await db.update(bookings)
      .set({ 
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: reason,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId))

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Cancel booking error:', error)
    return { success: false, error: 'Failed to cancel booking' }
  }
}