export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  location?: string;
  workInfo?: string;
  socialMedia?: string;
  photoUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Home {
  id: string;
  hostId: string;
  title: string;
  description: string;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: string;
  amenities?: string;
  houseRules?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  host?: User;
  photos?: HomePhoto[];
}

export interface HomePhoto {
  id: string;
  homeId: string;
  url: string;
  caption?: string;
  order: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  homeId: string;
  guestId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalAmount: string;
  status: 'pending' | 'approved' | 'declined' | 'paid' | 'completed' | 'cancelled';
  message?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  home?: Home;
  guest?: User;
}

export interface SearchFilters {
  location?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
}