import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { ListingWithRelations } from "@/types";

interface ListingCardProps {
  listing: ListingWithRelations;
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainPhoto = listing.photos[0]?.url || "/placeholder.jpg";

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-[4/3] relative">
          <Image
            src={mainPhoto}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            {listing.city}, {listing.country}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {listing.propertyType} • {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""} • {Number(listing.bathrooms)} bath{Number(listing.bathrooms) !== 1 ? "s" : ""}
          </p>
          <p className="font-semibold">
            {formatCurrency(Number(listing.pricePerNight))} <span className="font-normal text-muted-foreground">per night</span>
          </p>
        </div>
      </Card>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
      </div>
    </Card>
  );
}