// App-wide constants
export const APP_NAME = 'Musa Residency';
export const APP_DESCRIPTION = 'Creative home exchange platform for artists and remote workers';

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// Booking constraints
export const MIN_BOOKING_NIGHTS = 30;
export const MAX_BOOKING_NIGHTS = 365;
export const BOOKING_RESPONSE_HOURS = 24;
export const MAX_GUESTS_DEFAULT = 2;

// Payment
export const PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee
export const STRIPE_FEE_PERCENTAGE = 0.029; // 2.9% + 30c per transaction
export const STRIPE_FEE_FIXED = 30; // 30 cents

// File upload
export const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_PHOTOS_PER_LISTING = 20;

// Search
export const DEFAULT_SEARCH_RADIUS_KM = 50;
export const MAX_SEARCH_RADIUS_KM = 500;

// Visibility scores
export const RESPONSE_PENALTY_HOURS = 48;
export const RESPONSE_PENALTY_AMOUNT = 0.1;
export const NO_RESPONSE_PENALTY_AMOUNT = 0.2;

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: (id: string) => `user-profile-${id}`,
  LISTING: (id: string) => `listing-${id}`,
  LISTINGS_SEARCH: (params: string) => `listings-search-${params}`,
  USER_BOOKINGS: (id: string) => `user-bookings-${id}`,
  HOST_ANALYTICS: (id: string) => `host-analytics-${id}`,
} as const;

// Email templates
export const EMAIL_SUBJECTS = {
  BOOKING_REQUEST: 'New booking request for your listing',
  BOOKING_APPROVED: 'Your booking has been approved!',
  BOOKING_DECLINED: 'Update on your booking request',
  BOOKING_CANCELLED: 'Booking cancellation notice',
  PAYMENT_SUCCESS: 'Payment confirmation',
  WELCOME: 'Welcome to Musa Residency',
} as const;

// Amenities options
export const AMENITIES = [
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
  'Gym',
  'BBQ grill',
  'Outdoor dining area',
  'Fire pit',
  'Private entrance',
  'Piano',
  'Lake access',
  'Beach access',
  'Ski-in/ski-out',
  'Smoke alarm',
  'Carbon monoxide alarm',
] as const;

// Creative features
export const CREATIVE_FEATURES = [
  'Art studio',
  'Music room',
  'Photography studio',
  'Writing nook',
  'Library',
  'Gallery wall',
  'Performance space',
  'Recording equipment',
  'Pottery kiln',
  'Darkroom',
  'Dance studio',
  'Meditation room',
  'Natural light studio',
  'Outdoor workspace',
  'Inspiring views',
  'Quiet neighborhood',
  'Near art galleries',
  'Near cultural sites',
  'Artist community',
  'Creative workshops nearby',
] as const;

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  BOOKING_CONFLICT: 'These dates are no longer available.',
  RESPONSE_TIMEOUT: 'The host did not respond within 24 hours.',
} as const;