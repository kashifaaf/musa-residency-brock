export const APP_NAME = "Musa Residency"
export const APP_DESCRIPTION =
  "A curated home exchange platform connecting culturally-minded remote workers with unique homes for long-term stays."

// Booking
export const HOST_RESPONSE_WINDOW_HOURS = 24
export const MIN_STAY_NIGHTS_DEFAULT = 30
export const MAX_PHOTOS_PER_LISTING = 20

// Pricing
export const PLATFORM_FEE_PERCENT = 10
export const CURRENCY = "usd"

// Pagination
export const LISTINGS_PER_PAGE = 12
export const MESSAGES_PER_PAGE = 50
export const BOOKINGS_PER_PAGE = 10

// Responsiveness penalty thresholds
export const MIN_RESPONSE_RATE_PERCENT = 80
export const PENALTY_THRESHOLD_MISSED_RESPONSES = 3

// Search defaults
export const DEFAULT_GUESTS = 2

// Routes
export const ROUTES = {
  home: "/",
  search: "/search",
  listing: (id: string) => `/listings/${id}` as const,
  createListing: "/listings/new",
  editListing: (id: string) => `/listings/${id}/edit` as const,
  bookings: "/bookings",
  booking: (id: string) => `/bookings/${id}` as const,
  messages: (bookingId: string) => `/bookings/${bookingId}/messages` as const,
  profile: "/profile",
  editProfile: "/profile/edit",
  dashboard: "/dashboard",
  authSignIn: "/auth/signin",
} as const