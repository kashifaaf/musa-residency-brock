'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createListing } from '@/lib/actions/listings';

const commonAmenities = [
  'WiFi',
  'Kitchen',
  'Washing Machine',
  'Air Conditioning',
  'Heating',
  'Parking',
  'Workspace/Desk',
  'Art Studio Space',
  'Natural Light',
  'Quiet Environment',
  'Garden/Outdoor Space',
  'Piano/Musical Instruments',
];

export function CreateListingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    bedrooms: '1',
    bathrooms: '1',
    maxGuests: '2',
    pricePerNight: '',
    houseRules: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.pricePerNight) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await createListing({
        ...formData,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        maxGuests: parseInt(formData.maxGuests),
        pricePerNight: parseFloat(formData.pricePerNight),
        amenities: selectedAmenities,
      });

      if (result.success) {
        router.push('/dashboard?tab=listings');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Bright Artist Loft in Brooklyn"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your space, what makes it special for creative work..."
              rows={6}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                City/Region *
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Brooklyn, New York"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Full Address *
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Street address (kept private until booking)"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Property Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <Input
              type="number"
              id="bedrooms"
              name="bedrooms"
              min="1"
              max="10"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <Input
              type="number"
              id="bathrooms"
              name="bathrooms"
              min="1"
              max="10"
              step="0.5"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
              Max Guests
            </label>
            <Input
              type="number"
              id="maxGuests"
              name="maxGuests"
              min="1"
              max="20"
              value={formData.maxGuests}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night ($)
            </label>
            <Input
              type="number"
              id="pricePerNight"
              name="pricePerNight"
              min="1"
              step="1"
              placeholder="e.g., 75"
              value={formData.pricePerNight}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Amenities
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonAmenities.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* House Rules */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          House Rules
        </h3>
        
        <div>
          <label htmlFor="houseRules" className="block text-sm font-medium text-gray-700 mb-1">
            House Rules (Optional)
          </label>
          <Textarea
            id="houseRules"
            name="houseRules"
            placeholder="e.g., No smoking, No pets, Check-in after 3pm..."
            rows={4}
            value={formData.houseRules}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}