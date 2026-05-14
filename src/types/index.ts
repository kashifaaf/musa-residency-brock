import type { 
  users, 
  homes, 
  availability, 
  bookings, 
  payments, 
  messages, 
  notifications 
} from '@/lib/db/schema';

// Database type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Home = typeof homes.$inferSelect;
export type NewHome = typeof homes.$inferInsert;

export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// Extended types with relations
export type HomeWithHost = Home & {
  host: User;
};

export type HomeWithAvailability = Home & {
  availability: Availability[];
};

export type BookingWithDetails = Booking & {
  home: Home;
  guest: User;
  host: User;
  payment?: Payment | null;
};

export type MessageWithUsers = Message & {
  sender: User;
  recipient: User;
};

// Form/API types
export type CreateHomeInput = {
  title: string;
  description: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  amenities: {
    bedrooms: number;
    bathrooms: number;
    workspace: boolean;
    wifi: boolean;
    kitchen: boolean;
    parking: boolean;
    artStudio?: boolean;
    instruments?: boolean;
    other: string[];
  };
  houseRules?: string;
  images: string[];
};

export type CreateBookingInput = {
  homeId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  message?: string;
};

export type UpdateUserProfileInput = {
  name?: string;
  bio?: string;
  location?: string;
  workInfo?: string;
  profileImage?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export type SearchFilters = {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guestCount?: number;
  amenities?: string[];
  priceMin?: number;
  priceMax?: number;
};

// Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// Auth types
export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  isHost: boolean;
};

// Notification types
export type NotificationType = 
  | 'booking_request'
  | 'booking_approved'
  | 'booking_declined'
  | 'booking_cancelled'
  | 'message'
  | 'payment_success'
  | 'payment_failed';

// Status types
export type BookingStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';