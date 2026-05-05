export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export interface Home {
  id: string
  userId: string
  title: string
  description: string
  location: string
  pricePerNight: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string | null
  images: string[] | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  homeId: string
  guestId: string
  hostId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: string
  status: string
  stripePaymentIntentId: string | null
  message: string | null
  createdAt: Date
  updatedAt: Date
  responseDeadline: Date
}

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  location: string | null
  workInfo: string | null
  socialMedia: string | null
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}