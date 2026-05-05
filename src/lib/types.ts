import { Booking } from "./db/schema"

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export interface SearchFilters {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
}

export interface HomeWithHost {
  id: string
  title: string
  description: string
  address: string
  city: string
  country: string
  pricePerNight: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string[] | null
  photos: string[] | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  host: {
    id: string
    name: string
    image: string | null
    location: string | null
  }
}

export interface BookingWithDetails extends Booking {
  home: {
    title: string
    city: string
    country: string
    photos: string[] | null
  }
  guest: {
    name: string
    image: string | null
  }
  host: {
    name: string
    image: string | null
  }
}