import type { 
  users, 
  homes, 
  homeImages, 
  availability, 
  bookingRequests, 
  messages 
} from "@/lib/db/schema";

// Database type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Home = typeof homes.$inferSelect;
export type NewHome = typeof homes.$inferInsert;

export type HomeImage = typeof homeImages.$inferSelect;
export type NewHomeImage = typeof homeImages.$inferInsert;

export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;

export type BookingRequest = typeof bookingRequests.$inferSelect;
export type NewBookingRequest = typeof bookingRequests.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

// Extended types with relations
export type HomeWithImages = Home & {
  images: HomeImage[];
  user?: User;
};

export type HomeWithFullDetails = Home & {
  images: HomeImage[];
  user: User;
  availability: Availability[];
};

export type BookingRequestWithDetails = BookingRequest & {
  home: HomeWithImages;
  guest: User;
  host: User;
  messages?: Message[];
};

export type MessageWithUsers = Message & {
  sender: User;
  recipient: User;
};

// Enums and constants
export const BookingStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  DECLINED: "declined",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];

export const HomeType = {
  APARTMENT: "apartment",
  HOUSE: "house",
  STUDIO: "studio",
  LOFT: "loft",
  COTTAGE: "cottage",
  OTHER: "other",
} as const;

export type HomeTypeType = typeof HomeType[keyof typeof HomeType];

export const ArtistType = {
  VISUAL: "visual",
  WRITER: "writer",
  MUSICIAN: "musician",
  PERFORMER: "performer",
  FILMMAKER: "filmmaker",
  DESIGNER: "designer",
  OTHER: "other",
} as const;

export type ArtistTypeType = typeof ArtistType[keyof typeof ArtistType];

// Form/API types
export interface SearchFilters {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minBedrooms?: number;
  artistType?: ArtistTypeType;
  homeType?: HomeTypeType;
}

export interface CreateHomeInput {
  title: string;
  description: string;
  location: string;
  country: string;
  city: string;
  address?: string;
  homeType: HomeTypeType;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities?: string[];
  creativeAmenities?: string[];
  houseRules?: string;
  localArtScene?: string;
}

export interface CreateBookingRequestInput {
  homeId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Utility types
export type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string };