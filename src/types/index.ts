import type {
  User,
  Listing,
  Booking,
  Message,
  Notification,
  ListingPhoto,
  Availability,
} from '@/lib/db/schema';

// Extended types with relations
export type UserWithRelations = User & {
  listings?: Listing[];
  bookingsAsHost?: Booking[];
  bookingsAsGuest?: Booking[];
};

export type ListingWithRelations = Listing & {
  host?: User;
  photos?: ListingPhoto[];
  availability?: Availability[];
  bookings?: Booking[];
};

export type BookingWithRelations = Booking & {
  listing?: ListingWithRelations;
  host?: User;
  guest?: User;
  messages?: Message[];
};

export type MessageWithRelations = Message & {
  sender?: User;
  receiver?: User;
  booking?: Booking;
};

export type NotificationWithRelations = Notification & {
  user?: User;
  booking?: BookingWithRelations;
  listing?: ListingWithRelations;
};

// Form types
export type CreateListingFormData = {
  title: string;
  description: string;
  location: string;
  address?: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  houseRules?: string;
  creativeFeatures: string[];
  pricePerNight: number;
  currency: string;
};

export type CreateBookingFormData = {
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  guestMessage?: string;
};

export type UpdateProfileFormData = {
  name?: string;
  bio?: string;
  location?: string;
  workInfo?: string;
  socialMediaProfiles?: Record<string, string>;
};

// API Response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// Search/Filter types
export type ListingSearchParams = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  creativeFeatures?: string[];
  page?: number;
  limit?: number;
};

export type BookingFilters = {
  status?: 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed';
  role?: 'host' | 'guest';
  startDate?: string;
  endDate?: string;
};

// Stripe types
export type PaymentIntentData = {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
};

// Upload types
export type FileUploadResponse = {
  url: string;
  key: string;
  name: string;
  size: number;
};

// Notification preferences
export type NotificationPreferences = {
  emailBookingRequests: boolean;
  emailBookingUpdates: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  smsBookingRequests: boolean;
  smsBookingUpdates: boolean;
};

// Analytics types
export type HostAnalytics = {
  totalViews: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  responseRate: number;
  avgResponseTime: number;
  upcomingBookings: number;
  completedBookings: number;
};

// Calendar types
export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'booking' | 'blocked';
  bookingId?: string;
  guestName?: string;
};

// Review types (for future implementation)
export type Review = {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
};