'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SearchParams } from '@/lib/types';

interface SearchFormProps {
  initialValues?: SearchParams;
}

export function SearchForm({ initialValues = {} }: SearchFormProps) {
  const [location, setLocation] = useState(initialValues.location || '');
  const [startDate, setStartDate] = useState(initialValues.startDate || '');
  const [endDate, setEndDate] = useState(initialValues.endDate || '');
  const [guests, setGuests] = useState(initialValues.guests || '');
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('location', location);
    if (startDate) searchParams.set('startDate', startDate);
    if (endDate) searchParams.set('endDate', endDate);
    if (guests) searchParams.set('guests', guests);
    
    router.push(`/search?${searchParams.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Label htmlFor="location">Where</Label>
          <Input
            id="location"
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="startDate">Check in</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="endDate">Check out</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="10"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Button type="submit" className="w-full md:w-auto">
          Search
        </Button>
      </div>
    </form>
  );
}