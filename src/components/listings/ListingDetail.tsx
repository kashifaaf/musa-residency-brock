'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Listing, ListingPhoto } from '@/lib/db/schema';

interface ListingDetailProps {
  listing: Listing;
  photos: ListingPhoto[];
}

export function ListingDetail({ listing, photos }: ListingDetailProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{listing.location}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-lg overflow-hidden bg-muted">
          <Image
            src={photos[currentPhotoIndex].url}
            alt={photos[currentPhotoIndex].caption || listing.title}
            fill
            className="object-cover"
            priority
          />
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevPhoto}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextPhoto}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentPhotoIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="aspect-[16/9] md:aspect-[2/1] rounded-lg bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No photos available</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <section className="pb-8 border-b">
            <h2 className="text-xl font-semibold mb-4">About this space</h2>
            <p className="whitespace-pre-wrap">{listing.description}</p>
          </section>

          <section className="py-8 border-b">
            <h2 className="text-xl font-semibold mb-4">Space details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Bedrooms:</span> {listing.bedrooms}
              </div>
              <div>
                <span className="font-medium">Bathrooms:</span> {listing.bathrooms}
              </div>
              <div>
                <span className="font-medium">Max guests:</span> {listing.maxGuests}
              </div>
            </div>
          </section>

          {listing.amenities && listing.amenities.length > 0 && (
            <section className="py-8 border-b">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {listing.creativeFeatures && listing.creativeFeatures.length > 0 && (
            <section className="py-8 border-b">
              <h2 className="text-xl font-semibold mb-4">Creative Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.creativeFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {listing.houseRules && (
            <section className="py-8">
              <h2 className="text-xl font-semibold mb-4">House Rules</h2>
              <p className="whitespace-pre-wrap">{listing.houseRules}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}