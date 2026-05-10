import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';
import { listings, listingPhotos, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { MapPin } from 'lucide-react';

export async function FeaturedListings() {
  const db = getDb();
  
  const featuredListings = await db.select({
    listing: listings,
    host: users,
    photo: listingPhotos,
  })
  .from(listings)
  .leftJoin(users, eq(listings.hostId, users.id))
  .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
  .where(eq(listings.status, 'active'))
  .orderBy(desc(listings.createdAt))
  .limit(6);

  // Group by listing to get unique listings with their first photo
  const uniqueListings = featuredListings.reduce((acc, row) => {
    if (!acc.find(item => item.listing.id === row.listing.id)) {
      acc.push(row);
    }
    return acc;
  }, [] as typeof featuredListings);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueListings.map(({ listing, host, photo }) => (
        <Link key={listing.id} href={`/listings/${listing.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] relative">
              {photo ? (
                <Image
                  src={photo.url}
                  alt={listing.title}
                  fill
                  className="object-cover"
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
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{listing.location}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="font-semibold">{formatPrice(listing.pricePerNight)}</span>
                  <span className="text-muted-foreground text-sm"> / night</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {listing.bedrooms} bed · {listing.bathrooms} bath
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}