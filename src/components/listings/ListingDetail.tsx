"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Users, Bed, Bath, Wifi, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { ListingWithRelations } from "@/types";

interface ListingDetailProps {
  listing: ListingWithRelations;
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const photos = listing.photos.length > 0 ? listing.photos : [{ url: "/placeholder.jpg", id: "placeholder", order: 0 }];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Photo Gallery */}
      <div className="mb-8">
        <div className="aspect-[16/9] relative mb-4 rounded-lg overflow-hidden">
          <Image
            src={photos[selectedPhotoIndex].url}
            alt={listing.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
        
        {photos.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`aspect-square relative rounded overflow-hidden ${
                  index === selectedPhotoIndex ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={photo.url}
                  alt={`${listing.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Basic Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.city}, {listing.country}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {listing.maxGuests} guests
              </div>
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {Number(listing.bathrooms)} bathroom{Number(listing.bathrooms) !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                {listing.propertyType}
              </div>
            </div>
          </div>

          <Separator />

          {/* Host Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={listing.host.image || undefined} />
              <AvatarFallback>{listing.host.name?.[0] || "H"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">Hosted by {listing.host.name}</p>
              <p className="text-sm text-muted-foreground">{listing.host.location}</p>
              {listing.host.bio && (
                <p className="mt-2 text-sm">{listing.host.bio}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About this space</h2>
            <p className="whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Neighborhood */}
          {listing.neighborhoodDescription && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">The neighborhood</h2>
                <p className="whitespace-pre-wrap">{listing.neighborhoodDescription}</p>
              </div>
            </>
          )}

          {/* Amenities */}
          <Separator />
          <div>
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 gap-3">
              {listing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <Wifi className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
            
            {listing.creativeAmenities.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-3">Creative amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.creativeAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* House Rules */}
          {listing.houseRules && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">House rules</h2>
                <p className="whitespace-pre-wrap">{listing.houseRules}</p>
              </div>
            </>
          )}
        </div>

        {/* Booking Widget Placeholder */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 p-6">
            <div className="text-2xl font-bold mb-4">
              {formatCurrency(Number(listing.pricePerNight))}
              <span className="text-base font-normal text-muted-foreground"> / night</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Minimum stay: {listing.minimumStay} nights
            </p>
            <div className="text-center text-sm text-muted-foreground">
              Booking widget loads here for logged-in users
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}