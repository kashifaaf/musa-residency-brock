// Application constants
export const APP_NAME = 'Musa Residency'
export const APP_DESCRIPTION = 'Artist Home Exchange Platform'

export function getAPP_URL(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export const APP_URL = getAPP_URL()

// Pagination
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100

// Booking constraints
export const MIN_STAY_DAYS = 30
export const MAX_GUESTS = 10
export const BOOKING_RESPONSE_HOURS = 24

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_HOME_IMAGES = 20

// Search
export const DEFAULT_SEARCH_RADIUS_KM = 50
export const MAX_SEARCH_RADIUS_KM = 200

// Amenities
export const STANDARD_AMENITIES = [
  'WiFi',
  'Kitchen',
  'Washer',
  'Dryer',
  'Air conditioning',
  'Heating',
  'Dedicated workspace',
  'TV',
  'Hair dryer',
  'Iron',
  'Pool',
  'Hot tub',
  'Free parking',
  'EV charger',
  'Crib',
  'Gym',
  'BBQ grill',
  'Breakfast',
  'Indoor fireplace',
  'Smoking allowed',
  'Pets allowed',
  'Wheelchair accessible',
] as const

export const CREATIVE_AMENITIES = [
  'Art studio',
  'Music room',
  'Recording equipment',
  'Photography studio',
  'Darkroom',
  'Pottery kiln',
  'Woodworking tools',
  'Sewing machine',
  'Drawing tablet',
  'Musical instruments',
  'Art supplies',
  'Gallery space',
  'Performance space',
  'Library',
  'Natural light',
  'Inspiring views',
] as const

// Response time thresholds (hours)
export const RESPONSE_TIME_EXCELLENT = 1
export const RESPONSE_TIME_GOOD = 12
export const RESPONSE_TIME_FAIR = 24

// Visibility penalties
export const PENALTY_NO_RESPONSE_DAYS = 7
export const PENALTY_LOW_RESPONSE_RATE = 0.5 // 50%

// Currency
export const DEFAULT_CURRENCY = 'USD'
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const

// Map defaults
export const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.0060 } // New York
export const DEFAULT_MAP_ZOOM = 12

// Email
export const SYSTEM_EMAIL = 'no-reply@musaresidency.com'
export const SUPPORT_EMAIL = 'support@musaresidency.com'

// Cache TTL (seconds)
export const CACHE_TTL_SHORT = 60 // 1 minute
export const CACHE_TTL_MEDIUM = 300 // 5 minutes
export const CACHE_TTL_LONG = 3600 // 1 hour

// Rate limiting
export const RATE_LIMIT_REQUESTS = 100
export const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute