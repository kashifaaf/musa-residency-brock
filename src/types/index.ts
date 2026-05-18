import type {
  users,
  listings,
  listingPhotos,
  availability,
  bookings,
  payments,
  messages,
} from "@/lib/db/schema"

// ─── Drizzle inferred types ─────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert

export type ListingPhoto = typeof listingPhotos.$inferSelect
export type NewListingPhoto = typeof listingPhotos.$inferInsert

export type Availability = typeof availability.$inferSelect
export type NewAvailability = typeof availability.$inferInsert

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

// ─── Application types ──────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "approved"
  | "declined"
  | "expired"
  | "cancelled"
  | "completed"

export type PaymentStatus = "authorized" | "captured" | "refunded" | "failed"

export type ListingWithPhotos = Listing & {
  photos: ListingPhoto[]
}

export type ListingWithHost = Listing & {
  host: Pick<User, "id" | "name" | "image" | "location" | "bio">
  photos: ListingPhoto[]
}

export type BookingWithDetails = Booking & {
  listing: ListingWithPhotos
  guest: Pick<User, "id" | "name" | "image" | "location" | "bio" | "workInfo" | "socialLinks">
  host: Pick<User, "id" | "name" | "image">
  payment: Payment | null
}

export type MessageWithSender = Message & {
  sender: Pick<User, "id" | "name" | "image">
}

export type SearchParams = {
  city?: string
  country?: string
  checkIn?: string
  checkOut?: string
  guests?: string
  minPrice?: string
  maxPrice?: string
}

export type SocialLinks = {
  instagram?: string
  website?: string
  linkedin?: string
  twitter?: string
  [key: string]: string | undefined
}