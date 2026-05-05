'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toaster';

export function CreateHomeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const amenitiesString = formData.get('amenities') as string;
    const amenities = amenitiesString ? amenitiesString.split(',').map(a => a.trim()) : [];

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      pricePerNight: parseFloat(formData.get('pricePerNight') as string),
      bedrooms: parseInt(formData.get('bedrooms') as string),
      bathrooms: parseInt(formData.get('bathrooms') as string),
      maxGuests: parseInt(formData.get('maxGuests') as string),
      amenities,
      photos: [], // Photo upload would be implemented separately
    };

    try {
      const response = await fetch('/api/homes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast('Home listed successfully!', 'success');
        router.push('/dashboard/homes');
      } else {
        toast(result.error, 'error');
      }
    } catch (error) {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Home Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Beautiful Artist Loft in Brooklyn"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe your space, what makes it special, and what guests can expect..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          required
          placeholder="Brooklyn, NY"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePerNight">Price per night ($)</Label>
          <Input
            id="pricePerNight"
            name="pricePerNight"
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="maxGuests">Max guests</Label>
          <Input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            max="10"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            step="0.5"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma separated)</Label>
        <Input
          id="amenities"
          name="amenities"
          type="text"
          placeholder="WiFi, Kitchen, Workspace, Art Studio, Garden"
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating listing...' : 'List Your Home'}
      </Button>
    </form>
  );
}