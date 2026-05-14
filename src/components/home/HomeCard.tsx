"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home as HomeIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { HomeWithHost } from '@/types';

interface HomeCardProps {
  home: HomeWithHost;
}

export function HomeCard({ home }: HomeCardProps) {
  const primaryImage = home.images[0] || '/placeholder-home.jpg';
  const amenities = home.amenities as any;

  return (
    <Link href={`/homes/${home.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={primaryImage}
            alt={home.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{home.title}</h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {home.city}, {home.country}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" />
                {amenities.bedrooms} bed · {amenities.bathrooms} bath
              </span>
            </div>
            <p className="font-semibold">
              {formatCurrency(100)}/night
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}