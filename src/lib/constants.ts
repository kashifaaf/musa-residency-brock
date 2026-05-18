export const APP_NAME = "Musa Residency"
export const APP_DESCRIPTION =
  "A curated home exchange platform for culturally-minded remote workers and creative professionals."

export const BOOKING_EXPIRATION_HOURS = 24

export const BOOKING_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  PAID: "paid",
  ACTIVE: "active",
  COMPLETED: "completed",
  DECLINED: "declined",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
} as const

export const PROPERTY_TYPES = [
  "apartment",
  "house",
  "studio",
  "loft",
  "cottage",
  "townhouse",
  "cabin",
  "other",
] as const

export const COMMON_AMENITIES = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "Dedicated workspace",
  "TV",
  "Parking",
  "Elevator",
  "Pool",
  "Gym",
  "Patio/Balcony",
  "Garden",
  "Pet-friendly",
] as const

export const CREATIVE_AMENITIES = [
  "Art studio",
  "Music room",
  "Piano/Keyboard",
  "Guitar(s)",
  "Recording equipment",
  "Easel",
  "Pottery wheel",
  "Darkroom",
  "Writing desk",
  "Library",
  "Natural light studio",
  "Soundproofed room",
  "Projector",
  "Large work table",
  "Storage for art supplies",
] as const

export const MINIMUM_STAY_DEFAULT = 1
export const MAXIMUM_STAY_DEFAULT = 365
export const MAX_PHOTOS_PER_LISTING = 20

export const RESPONSE_PENALTY_THRESHOLD = 3 // After 3 non-responses, listing visibility decreases