'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card } from './ui/Card';
import { ImageUpload } from './ImageUpload';
import { createHome } from '@/app/actions/homes';

export function HomeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    maxGuests: 2,
    amenities: [] as string[],
    photos: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createHome(formData);
      if (result.success) {
        router.push('/host/homes');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to create home listing');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({ ...prev, photos: urls }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const commonAmenities = [
    'WiFi',
    'Kitchen',
    'Workspace',
    'Art Studio',
    'Natural Light',
    'Quiet Area',
    'Garden/Outdoor Space',
    'Parking',
    'Washing Machine',
    'Air Conditioning',
  ];

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Home Title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          placeholder="e.g., Bright Artist Loft in Brooklyn"
        />

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
          placeholder="City, Country"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          placeholder="Describe your space, what makes it special, and what you can offer to visiting artists..."
          rows={6}
        />

        <Input
          label="Maximum Guests"
          type="number"
          value={formData.maxGuests}
          onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) }))}
          required
          min={1}
          max={10}
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Amenities
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {commonAmenities.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Photos
          </label>
          <ImageUpload
            onUpload={handleImageUpload}
            existingImages={formData.photos}
            maxImages={10}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Create Home Listing
        </Button>
      </form>
    </Card>
  );
}