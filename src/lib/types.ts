export interface ActionResult<T> {
  success: true;
  data: T;
}

export interface ActionError {
  success: false;
  error: string;
}

export type ActionResponse<T> = ActionResult<T> | ActionError;

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  location?: string;
  workInfo?: string;
  socialMedia?: string;
  profilePhoto?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Home {
  id: string;
  hostId: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[] | null;
  photos: string[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  host?: User;
}

export interface BookingRequest {
  id: string;
  homeId: string;
  guestId: string;
  hostId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  guestCount: number;
  message?: string;
  status: 'pending' | 'approved' | 'declined' | 'paid' | 'cancelled';
  paymentIntentId?: string;
  hostResponseDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
  home?: Home;
  guest?: User;
  host?: User;
}

export interface SearchParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  guests?: string;
}