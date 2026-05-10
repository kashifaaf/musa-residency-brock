export const APP_NAME = "Musa Residency";
export const APP_DESCRIPTION = "Artist Home Exchange Platform";

// Booking constraints
export const MIN_STAY_DAYS = 7;
export const MAX_STAY_DAYS = 90;
export const BOOKING_REQUEST_EXPIRY_HOURS = 24;
export const MAX_GUESTS_DEFAULT = 4;

// Pagination
export const ITEMS_PER_PAGE = 12;
export const MAX_PAGE_SIZE = 50;

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_HOME_IMAGES = 20;

// Response time thresholds (in hours)
export const RESPONSE_TIME_EXCELLENT = 1;
export const RESPONSE_TIME_GOOD = 6;
export const RESPONSE_TIME_FAIR = 12;

// Home types
export const HomeType = {
  APARTMENT: "apartment",
  HOUSE: "house",
  STUDIO: "studio",
  LOFT: "loft",
  CONDO: "condo",
  TOWNHOUSE: "townhouse",
  OTHER: "other",
} as const;

export type HomeType = typeof HomeType[keyof typeof HomeType];

// Amenities options
export const BASIC_AMENITIES = [
  "wifi",
  "kitchen",
  "washer",
  "dryer",
  "air_conditioning",
  "heating",
  "workspace",
  "tv",
  "parking",
  "elevator",
  "pool",
  "gym",
  "balcony",
  "garden",
] as const;

export const CREATIVE_AMENITIES = [
  "art_studio",
  "music_room",
  "recording_equipment",
  "piano",
  "guitar",
  "easel",
  "pottery_wheel",
  "darkroom",
  "dance_studio",
  "writing_desk",
  "library",
  "gallery_wall",
  "natural_light",
  "high_ceilings",
] as const;

// Email templates
export const EMAIL_SUBJECTS = {
  VERIFICATION: "Verify your email for Musa Residency",
  PASSWORD_RESET: "Reset your password",
  BOOKING_REQUEST: "New booking request for your home",
  BOOKING_APPROVED: "Your booking has been approved!",
  BOOKING_DECLINED: "Update on your booking request",
  BOOKING_REMINDER: "Response needed: Booking request expiring soon",
} as const;

// Stripe
export const STRIPE_FEE_PERCENTAGE = 0.15; // 15% platform fee

// SEO
export const DEFAULT_OG_IMAGE = "/og-image.png";