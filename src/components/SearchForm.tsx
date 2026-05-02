'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    location: searchParams.get('location') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    guests: searchParams.get('guests') || '2',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (formData.location) params.set('location', formData.location);
    if (formData.startDate) params.set('startDate', formData.startDate);
    if (formData.endDate) params.set('endDate', formData.endDate);
    if (formData.guests) params.set('guests', formData.guests);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          label="Where"
          placeholder="City, country..."
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
        />
        
        <Input
          label="Check-in"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
        />
        
        <Input
          label="Check-out"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
        />
        
        <Input
          label="Guests"
          type="number"
          min="1"
          max="10"
          value={formData.guests}
          onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
        />
        
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Search
          </Button>
        </div>
      </form>
    </Card>
  );
}