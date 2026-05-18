import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type {
  users,
  listings,
  listingPhotos,
  availability,
  bookings,
  messages,
} from "@/lib/db/schema"
import type { BOOKING_STATUS, PROPERTY_TYPES } from "@/lib/constants"

// ─── Database Model Types ─────────────────────────────────────────────────────

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Listing = InferSelectModel<typeof listings>
export type NewListing = InferInsertModel<typeof listings>

export type ListingPhoto = InferSelectModel<typeof listingPhotos>
export type NewListingPhoto = InferInsertModel<typeof listingPhotos>

export type Availability = InferSelectModel<typeof availability>
export type NewAvailability = InferInsertModel<typeof availability>

export type Booking = InferSelectModel<typeof bookings>
export type NewBooking = InferInsertModel<typeof bookings>

export type Message = InferSelectModel<typeof messages>
export type NewMessage = InferInsertModel<typeof messages>

// ─── Enum Types ───────────────────────────────────────────────────────────────

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

export type PropertyType = (typeof PROPERTY_TYPES)[number]

// ─── Extended / Joined Types ──────────────────────────────────────────────────

export type ListingWithPhotos = Listing & {
  photos: ListingPhoto[]
}

export type ListingWithHost = Listing & {
  host: Pick<User, "id" | "name" | "image" | "bio" | "location">
  photos: ListingPhoto[]
}

export type BookingWithDetails = Booking & {
  listing: ListingWithPhotos
  guest: Pick<User, "id" | "name" | "image" | "bio" | "location" | "occupation">
  host: Pick<User, "id" | "name" | "image">
}

export type MessageWithSender = Message & {
  sender: Pick<User, "id" | "name" | "image">
}

// ─── Search / Filter Types ────────────────────────────────────────────────────

export type SearchFilters = {
  city?: string
  country?: string
  checkIn?: Date
  checkOut?: Date
  guests?: number
  minPrice?: number
  maxPrice?: number
  propertyType?: PropertyType
}

export type SearchResult = ListingWithHost & {
  availableDates: Availability[]
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
  }
}

// ─── API Response Types ───────────────────────────────────────────────────────

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type PaginatedResponse<T> = ApiResponse<{
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}>