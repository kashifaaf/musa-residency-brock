// Application constants
export const APP_NAME = "Musa Residency";

let __APP_URLInstance: string | null = null;
export function getAPP_URL() {
  if (!__APP_URLInstance) {
    __APP_URLInstance = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
  return __APP_URLInstance;
}

// Booking constraints
export const MIN_STAY_NIGHTS = 30;
export const MAX_STAY_NIGHTS = 90;
export const BOOKING_RESPONSE_HOURS = 24;
export const MAX_GUESTS_DEFAULT = 4;

// Payment
let __STRIPE_PUBLISHABLE_KEYInstance: string | null = null;
export function getSTRIPE_PUBLISHABLE_KEY() {
  if (!__STRIPE_PUBLISHABLE_KEYInstance) {
    __STRIPE_PUBLISHABLE_KEYInstance = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
  }
  return __STRIPE_PUBLISHABLE_KEYInstance;
}

export const CURRENCY = "USD";
export const PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee

// Image upload
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGES_PER_HOME = 20;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Search defaults
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_SEARCH_RADIUS_KM = 50;

// Property types
export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
] as const;

// Common amenities
export const AMENITIES = [
  "WiFi",
  "Kitchen",
  "Workspace",
  "Parking",
  "Air conditioning",
  "Heating",
  "Washer",
  "Dryer",
  "TV",
  "Coffee maker",
  "Dishwasher",
  "Gym",
  "Pool",
  "Garden",
  "Balcony",
  "Pet friendly",
] as const;

// Email templates
export const EMAIL_SUBJECTS = {
  BOOKING_REQUEST: "New booking request for your home",
  BOOKING_APPROVED: "Your booking request has been approved!",
  BOOKING_DECLINED: "Update on your booking request",
  BOOKING_REMINDER: "Response needed: Booking request expiring soon",
  WELCOME: `Welcome to ${APP_NAME}!`,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  UNAUTHORIZED: "You must be logged in to perform this action.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  PAYMENT_FAILED: "Payment processing failed. Please try again.",
} as const;