"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const amenityOptions = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'workspace', label: 'Workspace' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'parking', label: 'Parking' },
  { value: 'artStudio', label: 'Art Studio' },
  { value: 'instruments', label: 'Musical Instruments' },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleFilterChange = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(v => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/homes?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/homes');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
        >
          Clear all
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label>Price per night</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder="Min"
              value={searchParams.get('priceMin') || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={searchParams.get('priceMax') || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label>Amenities</Label>
          <div className="space-y-2 mt-2">
            {amenityOptions.map((amenity) => (
              <div key={amenity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.value}
                  checked={searchParams.getAll('amenities').includes(amenity.value)}
                  onCheckedChange={(checked) => {
                    const current = searchParams.getAll('amenities');
                    let updated;
                    if (checked) {
                      updated = [...current, amenity.value];
                    } else {
                      updated = current.filter(a => a !== amenity.value);
                    }
                    handleFilterChange('amenities', updated);
                  }}
                />
                <Label
                  htmlFor={amenity.value}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}