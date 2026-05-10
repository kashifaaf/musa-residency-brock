import { InferSelectModel } from "drizzle-orm";
import { users, homes, bookingRequests, availability, messages, emailNotifications } from "@/lib/db/schema";

// Database model types
export type User = InferSelectModel<typeof users>;
export type Home = InferSelectModel<typeof homes>;
export type BookingRequest = InferSelectModel<typeof bookingRequests>;
export type Availability = InferSelectModel<typeof availability>;
export type Message = InferSelectModel<typeof messages>;
export type EmailNotification = InferSelectModel<typeof emailNotifications>;

// Extended types with relations
export type HomeWithHost = Home & {
  host: User;
};

export type BookingRequestWithRelations = BookingRequest & {
  home: HomeWithHost;
  guest: User;
  messages?: Message[];
};

export type MessageWithSender = Message & {
  sender: User;
};

// Form/Input types
export type CreateHomeInput = {
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  propertyType: "apartment" | "house" | "studio" | "loft";
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  houseRules: string[];
};

export type CreateBookingRequestInput = {
  homeId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  message?: string;
};

export type UpdateAvailabilityInput = {
  homeId: string;
  dates: Array<{
    startDate: Date;
    endDate: Date;
    isBlocked?: boolean;
  }>;
};

// API response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Search/Filter types
export type HomeSearchFilters = {
  city?: string;
  country?: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  propertyType?: string;
  minBedrooms?: number;
};

// Status types
export type BookingStatus = "pending" | "approved" | "declined" | "expired" | "cancelled";
export type PaymentStatus = "pending" | "authorized" | "captured" | "refunded";

// Notification types
export type NotificationType = 
  | "booking_request"
  | "booking_approved" 
  | "booking_declined"
  | "booking_cancelled"
  | "booking_reminder"
  | "message_received";