'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AMENITIES, CREATIVE_FEATURES, SUPPORTED_CURRENCIES } from '@/lib/constants';
import { createListing } from '@/actions/listings';
import { UploadButton } from '@/components/upload/UploadButton';
import { useToast } from '@/hooks/use-toast';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(3, 'Location is required'),
  address: z.string().optional(),
  maxGuests: z.number().min(1).max(20),
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  pricePerNight: z.number().min(1),
  currency: z.string(),
  houseRules: z.string().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

export function CreateListingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ url: string; key: string }>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      pricePerNight: 100,
      currency: 'USD',
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createListing({
        ...data,
        amenities: selectedAmenities,
        creativeFeatures: selectedFeatures,
        photos: uploadedPhotos,
      });

      if (result.success && result.data) {
        toast({
          title: 'Success',
          description: 'Your listing has been created successfully!',
        });
        router.push(`/listings/${result.data.id}`);
      } else {
        throw new Error(result.error || 'Failed to create listing');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create listing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Cozy artist studio in Brooklyn"
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            rows={5}
            placeholder="Describe your space, its unique features, and what makes it special for creatives..."
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Brooklyn, New York"
            />
            {errors.location && (
              <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Will be shared with confirmed guests"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="maxGuests">Max Guests</Label>
            <Input
              id="maxGuests"
              type="number"
              {...register('maxGuests', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              {...register('bedrooms', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              step="0.5"
              {...register('bathrooms', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pricePerNight">Price per Night</Label>
            <Input
              id="pricePerNight"
              type="number"
              {...register('pricePerNight', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select defaultValue="USD" onValueChange={(value) => setValue('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Photos</Label>
          <div className="space-y-4">
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={photo.key} className="relative">
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos(uploadedPhotos.filter(p => p.key !== photo.key))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <UploadButton
              endpoint="listingPhotos"
              onClientUploadComplete={(res) => {
                if (res) {
                  setUploadedPhotos([...uploadedPhotos, ...res.map(r => ({ url: r.url, key: r.key }))]);
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: 'Upload failed',
                  description: error.message,
                  variant: 'destructive',
                });
              }}
            />
          </div>
        </div>

        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAmenities([...selectedAmenities, amenity]);
                    } else {
                      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                    }
                  }}
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Creative Features</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {CREATIVE_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFeatures([...selectedFeatures, feature]);
                    } else {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                    }
                  }}
                />
                <Label
                  htmlFor={`feature-${feature}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="houseRules">House Rules (optional)</Label>
          <Textarea
            id="houseRules"
            {...register('houseRules')}
            rows={3}
            placeholder="Any specific rules or guidelines for guests..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}