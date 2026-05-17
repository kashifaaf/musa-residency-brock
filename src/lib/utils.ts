import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(dateObj)
}

export function formatDateRange(startDate: Date | string, endDate: Date | string) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()
  
  if (startYear === endYear) {
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}, ${startYear}`
    }
    
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${startYear}`
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string) {
  const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export function isWithin24Hours(date: Date | string) {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = targetDate.getTime() - now.getTime()
  const diffHours = diffTime / (1000 * 60 * 60)
  
  return diffHours > 0 && diffHours <= 24
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}