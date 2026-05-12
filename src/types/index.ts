import { z } from "zod";
import type { 
  users, 
  listings, 
  listingPhotos, 
  availability, 
  bookings, 
  payments, 
  messages 
} from "@/lib/db/schema";

// Database type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type ListingPhoto = typeof listingPhotos.$inferSelect;
export type NewListingPhoto = typeof listingPhotos.$inferInsert;
export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

// Extended types with relations
export type ListingWithRelations = Listing & {
  host: User;
  photos: ListingPhoto[];
  availability?: Availability[];
};

export type BookingWithRelations = Booking & {
  listing: ListingWithRelations;
  guest: User;
  host: User;
  payment?: Payment;
  messages?: Message[];
};

// Form schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().min(2, "Location is required"),
  workInfo: z.string().max(200, "Work info must be less than 200 characters").optional(),
  socialLinks: z.object({
    website: z.string().url().optional().or(z.literal("")),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(100, "Description must be at least 100 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  propertyType: z.string().min(2, "Property type is required"),
  maxGuests: z.number().min(1).max(10),
  bedrooms: z.number().min(0).max(10),
  bathrooms: z.number().min(0.5).max(10).multipleOf(0.5),
  amenities: z.array(z.string()),
  creativeAmenities: z.array(z.string()),
  houseRules: z.string().max(1000).optional(),
  neighborhoodDescription: z.string().max(500).optional(),
  pricePerNight: z.number().min(0),
  minimumStay: z.number().min(1).max(365),
});

export const availabilitySchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const bookingRequestSchema = z.object({
  listingId: z.string().uuid(),
  checkIn: z.date(),
  checkOut: z.date(),
  guestCount: z.number().min(1).max(10),
  guestMessage: z.string().max(1000).optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

// API response types
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Search/filter types
export type ListingSearchParams = {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenities?: string[];
};

export type BookingFilters = {
  status?: "pending" | "approved" | "declined" | "cancelled" | "completed";
  role?: "guest" | "host";
  startDate?: Date;
  endDate?: Date;
};

// Utility types
export type UserRole = "guest" | "host" | "both";
export type BookingStatus = "pending" | "approved" | "declined" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "authorized" | "captured" | "refunded" | "failed";
export type ListingStatus = "draft" | "published" | "paused" | "archived";