'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays } from 'date-fns'
import type { Home } from '@/lib/db/schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Calendar } from '@/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { createBookingRequest } from '@/actions/bookings'
import { formatPrice, calculateNights, cn } from '@/lib/utils'
import { CalendarIcon, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface BookingRequestModalProps {
  home: Home
  onClose: () => void
}

export function BookingRequestModal({ home, onClose }: BookingRequestModalProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const tomorrow = addDays(new Date(), 1)
  const defaultCheckOut = addDays(tomorrow, home.minimumStay)
  
  const [checkIn, setCheckIn] = useState<Date>(tomorrow)
  const [checkOut, setCheckOut] = useState<Date>(defaultCheckOut)
  const [guests, setGuests] = useState(2)
  const [message, setMessage] = useState('')

  const nights = calculateNights(checkIn, checkOut)
  const totalPrice = nights * parseFloat(home.pricePerNight)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createBookingRequest({
        homeId: home.id,
        checkIn: format(checkIn, 'yyyy-MM-dd'),
        checkOut: format(checkOut, 'yyyy-MM-dd'),
        guests,
        message,
      })

      if (!result.success) {
        setError(result.error || 'Failed to create booking request')
        return
      }

      router.push(`/bookings/${result.data.id}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request to Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 text-sm text-error-600 bg-error-50 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !checkIn && 'text-gray-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      if (date) {
                        setCheckIn(date)
                        const minCheckOut = addDays(date, home.minimumStay)
                        if (checkOut <= date || checkOut < minCheckOut) {
                          setCheckOut(minCheckOut)
                        }
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Check out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !checkOut && 'text-gray-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => {
                      if (date) {
                        setCheckOut(date)
                      }
                    }}
                    disabled={(date) => {
                      const minDate = addDays(checkIn, home.minimumStay)
                      return date < minDate
                    }}
                    initialFocus
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="guests">Number of guests</Label>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4 text-gray-500" />
              <Input
                id="guests"
                type="number"
                min="1"
                max={home.maxGuests}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <span className="text-sm text-gray-500">
                (max {home.maxGuests})
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message to host (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and share why you'd like to stay here..."
              rows={4}
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>{formatPrice(parseFloat(home.pricePerNight))} x {nights} nights</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You won't be charged until the host approves your request.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || nights < home.minimumStay}
              className="flex-1"
            >
              {isSubmitting ? 'Sending request...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}