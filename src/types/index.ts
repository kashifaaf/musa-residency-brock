export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export interface SearchParams {
  location?: string
  startDate?: string
  endDate?: string
  guests?: string
}

export interface BookingRequest {
  homeId: string
  startDate: string
  endDate: string
  message?: string
}