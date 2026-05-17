export type BookingStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded'

export interface SearchParams {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  page?: number
  limit?: number
}

export interface BookingRequest {
  homeId: string
  checkIn: string
  checkOut: string
  guests: number
  message?: string
}

export interface HomeFilters {
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  creativeAmenities?: string[]
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  image?: string
  isHost: boolean
}

export interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface DateRange {
  from: Date
  to: Date
}

export interface NotificationPreferences {
  email: {
    bookingRequests: boolean
    bookingUpdates: boolean
    messages: boolean
    marketing: boolean
  }
  sms?: {
    bookingRequests: boolean
    bookingUpdates: boolean
  }
}