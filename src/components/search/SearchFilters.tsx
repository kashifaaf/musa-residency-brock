'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SearchFiltersProps {
  initialFilters: {
    location?: string;
    startDate?: string;
    endDate?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export function SearchFilters({ initialFilters }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    guests: initialFilters.guests || '2',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      }
    });

    router.push(`/search?${newSearchParams.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      startDate: '',
      endDate: '',
      guests: '2',
      minPrice: '',
      maxPrice: '',
    });
    router.push('/search');
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filters
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            type="text"
            id="location"
            name="location"
            placeholder="City or region"
            value={filters.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <Input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max="10"
            value={filters.guests}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <Input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="$0"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <Input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="$1000"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </form>
    </div>
  );
}