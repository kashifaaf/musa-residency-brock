import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import type { Listing, ListingPhoto } from '@/lib/db/schema';

interface ListingCardProps {
  listing: Listing;
  photo?: ListingPhoto | null;
}

export function ListingCard({ listing, photo }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-[4/3] relative">
          {photo ? (
            <Image
              src={photo.url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No photo</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="font-semibold">{formatPrice(listing.pricePerNight, listing.currency)}</span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {listing.bedrooms} bed · {listing.bathrooms} bath
            </span>
          </div>
          {listing.creativeFeatures && listing.creativeFeatures.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {listing.creativeFeatures.slice(0, 2).map((feature) => (
                <span key={feature} className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
              {listing.creativeFeatures.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{listing.creativeFeatures.length - 2} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}