export const APP_NAME = 'Musa Residency';
export const APP_DESCRIPTION = 'Connect with artists worldwide through creative space exchanges';

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const NOTIFICATION_TYPES = {
  BOOKING_REQUEST: 'booking_request',
  BOOKING_APPROVED: 'booking_approved',
  BOOKING_DECLINED: 'booking_declined',
  BOOKING_CANCELLED: 'booking_cancelled',
  MESSAGE: 'message',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const RESPONSE_TIME_LIMIT = 24; // hours

export const MINIMUM_STAY = 30; // days

export const DEFAULT_CURRENCY = 'USD';

export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const MAX_IMAGES_PER_HOME = 10;

export const VISIBILITY_PENALTY_THRESHOLD = 70; // response rate percentage

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

export const STRIPE_CONFIG = {
  PAYMENT_METHOD_TYPES: ['card'],
  CURRENCY: 'usd',
} as const;