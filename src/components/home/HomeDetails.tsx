"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Home as HomeIcon, 
  Wifi, 
  Car, 
  Briefcase,
  Palette,
  Music
} from 'lucide-react';
import type { HomeWithHost } from '@/types';

interface HomeDetailsProps {
  home: HomeWithHost;
}

export function HomeDetails({ home }: HomeDetailsProps) {
  const amenities = home.amenities as any;

  const amenityIcons = {
    wifi: <Wifi className="h-5 w-5" />,
    parking: <Car className="h-5 w-5" />,
    workspace: <Briefcase className="h-5 w-5" />,
    artStudio: <Palette className="h-5 w-5" />,
    instruments: <Music className="h-5 w-5" />,
  };

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
        {home.images.length > 0 ? (
          <>
            <div className="col-span-2 relative h-96">
              <Image
                src={home.images[0]}
                alt={home.title}
                fill
                className="object-cover"
              />
            </div>
            {home.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative h-48">
                <Image
                  src={image}
                  alt={`${home.title} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center">
            <HomeIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Title and Location */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{home.title}</h1>
        <p className="text-lg text-gray-600 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {home.city}, {home.state && `${home.state}, `}{home.country}
        </p>
      </div>

      {/* Host Info */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="h-12 w-12">
          <AvatarImage src={home.host.profileImage || ''} />
          <AvatarFallback>
            {home.host.name?.charAt(0) || home.host.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">Hosted by {home.host.name || 'Host'}</p>
          {home.host.responseRate && (
            <p className="text-sm text-gray-600">
              {home.host.responseRate}% response rate
            </p>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Bedrooms</p>
          <p className="text-2xl">{amenities.bedrooms}</p>
        </div>
        <div>
          <p className="font-medium">Bathrooms</p>
          <p className="text-2xl">{amenities.bathrooms}</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">About this space</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{home.description}</p>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(amenities).map(([key, value]) => {
            if (key === 'bedrooms' || key === 'bathrooms' || key === 'other' || !value) return null;
            return (
              <div key={key} className="flex items-center space-x-2">
                {amenityIcons[key as keyof typeof amenityIcons] || <HomeIcon className="h-5 w-5" />}
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            );
          })}
          {amenities.other?.map((item: string) => (
            <div key={item} className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* House Rules */}
      {home.houseRules && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">House Rules</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{home.houseRules}</p>
        </div>
      )}
    </div>
  );
}