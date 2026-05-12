export const APP_NAME = "Musa Residency";

function getAPP_URL(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

let __APP_URLInstance: string | null = null;

function getCachedAPP_URL(): string {
  if (!__APP_URLInstance) {
    __APP_URLInstance = getAPP_URL();
  }
  return __APP_URLInstance;
}

export const APP_URL = new Proxy({} as any, {
  get(_, prop) {
    const target = getCachedAPP_URL();
    if (typeof prop === 'string' && prop in String.prototype) {
      const value = (target as any)[prop];
      return typeof value === "function" ? value.bind(target) : value;
    }
    return target;
  },
});

// Booking constants
export const BOOKING_RESPONSE_TIME_HOURS = 24;
export const MIN_BOOKING_DAYS = 30;
export const MAX_BOOKING_DAYS = 365;
export const BOOKING_CANCELLATION_WINDOW_HOURS = 48;

// Payment constants  
export const STRIPE_FEE_PERCENTAGE = 0.15; // 15% platform fee
export const CURRENCY = "USD";

// Image upload
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGES_PER_LISTING = 20;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Property types
export const PROPERTY_TYPES = [
  "Apartment",
  "House", 
  "Studio",
  "Loft",
  "Villa",
  "Cottage",
  "Townhouse",
  "Other",
] as const;

// Amenities
export const GENERAL_AMENITIES = [
  "Wi-Fi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "Dedicated workspace",
  "TV",
  "Hair dryer",
  "Iron",
  "Essentials",
  "Smoke alarm",
  "Carbon monoxide alarm",
  "Fire extinguisher",
  "First aid kit",
] as const;

export const CREATIVE_AMENITIES = [
  "Art studio",
  "Music room",
  "Photography studio",
  "Dance studio",
  "Writing desk",
  "Library/Reading room",
  "Gallery wall",
  "Natural light",
  "Inspiring views",
  "Garden/Outdoor space",
  "Workshop space",
  "Pottery kiln",
  "Dark room",
  "Recording equipment",
  "Piano/Instruments",
] as const;

// Response rate thresholds
export const RESPONSE_RATE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  NEEDS_IMPROVEMENT: 50,
} as const;

// Search defaults
export const DEFAULT_SEARCH_RADIUS_KM = 50;
export const DEFAULT_PAGE_SIZE = 12;

// Email settings
export const EMAIL_FROM = "Musa Residency <noreply@musa-residency.com>";

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be signed in to perform this action",
  FORBIDDEN: "You do not have permission to perform this action",
  NOT_FOUND: "The requested resource was not found",
  BAD_REQUEST: "Invalid request",
  INTERNAL_ERROR: "Something went wrong. Please try again later",
  PAYMENT_FAILED: "Payment processing failed. Please try again",
  BOOKING_CONFLICT: "These dates are no longer available",
  RESPONSE_TIMEOUT: "The host did not respond within 24 hours",
} as const;