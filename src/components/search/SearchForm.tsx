'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { CalendarIcon, Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFormProps {
  onSearch: (params: {
    location: string
    checkIn: string
    checkOut: string
    guests: number
  }) => void | Promise<void>
  isLoading?: boolean
  initialValues?: {
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: number
  }
}

export function SearchForm({ onSearch, isLoading, initialValues }: SearchFormProps) {
  const [location, setLocation] = useState(initialValues?.location || '')
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialValues?.checkIn ? new Date(initialValues.checkIn) : undefined
  )
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialValues?.checkOut ? new Date(initialValues.checkOut) : undefined
  )
  const [guests, setGuests] = useState(initialValues?.guests || 2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !checkIn || !checkOut) return

    onSearch({
      location,
      checkIn: format(checkIn, 'yyyy-MM-dd'),
      checkOut: format(checkOut, 'yyyy-MM-dd'),
      guests,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="City or country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

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
                onSelect={setCheckIn}
                disabled={(date) =>
                  date < new Date() || (checkOut ? date >= checkOut : false)
                }
                initialFocus
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
                onSelect={setCheckOut}
                disabled={(date) =>
                  date < new Date() || (checkIn ? date <= checkIn : false)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="guests">Guests</Label>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Input
              id="guests"
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !location || !checkIn || !checkOut}
          className="px-8"
        >
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </form>
  )
}