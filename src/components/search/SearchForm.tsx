"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

export function SearchForm() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    
    router.push(`/homes?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="location" className="sr-only">Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              type="text"
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="checkIn" className="sr-only">Check in</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="checkIn"
              type="date"
              placeholder="Check in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="pl-10"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="checkOut" className="sr-only">Check out</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="checkOut"
              type="date"
              placeholder="Check out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="pl-10"
              min={checkIn || format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="guests" className="sr-only">Guests</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="guests"
              type="number"
              placeholder="Guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="pl-10"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full mt-4" size="lg">
        Search
      </Button>
    </form>
  );
}