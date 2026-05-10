import { getDb } from '@/lib/db';
import { listings, listingPhotos } from '@/lib/db/schema';
import { eq, and, gte, lte, inArray, like, sql } from 'drizzle-orm';
import { ListingCard } from './ListingCard';

interface ListingsGridProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function ListingsGrid({ searchParams }: ListingsGridProps) {
  const db = getDb();
  
  const conditions = [eq(listings.status, 'active')];
  
  // Location filter
  if (searchParams.location) {
    conditions.push(like(listings.location, `%${searchParams.location}%`));
  }
  
  // Price filters
  if (searchParams.minPrice) {
    conditions.push(gte(listings.pricePerNight, searchParams.minPrice));
  }
  if (searchParams.maxPrice) {
    conditions.push(lte(listings.pricePerNight, searchParams.maxPrice));
  }
  
  // Guest count filter
  if (searchParams.guests) {
    conditions.push(gte(listings.maxGuests, parseInt(searchParams.guests as string)));
  }

  // Amenities filter
  if (searchParams.amenities) {
    const amenitiesArray = (searchParams.amenities as string).split(',');
    conditions.push(
      sql`${listings.amenities} @> ${JSON.stringify(amenitiesArray)}::jsonb`
    );
  }

  // Creative features filter
  if (searchParams.features) {
    const featuresArray = (searchParams.features as string).split(',');
    conditions.push(
      sql`${listings.creativeFeatures} @> ${JSON.stringify(featuresArray)}::jsonb`
    );
  }

  const results = await db.select({
    listing: listings,
    photo: listingPhotos,
  })
  .from(listings)
  .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
  .where(and(...conditions))
  .orderBy(listings.createdAt);

  // Group by listing
  const groupedListings = results.reduce((acc, row) => {
    const existing = acc.find(item => item.listing.id === row.listing.id);
    if (existing && row.photo) {
      existing.photos.push(row.photo);
    } else {
      acc.push({
        listing: row.listing,
        photos: row.photo ? [row.photo] : [],
      });
    }
    return acc;
  }, [] as Array<{ listing: typeof listings.$inferSelect; photos: Array<typeof listingPhotos.$inferSelect> }>);

  if (groupedListings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No listings found matching your criteria.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search in a different location.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groupedListings.map(({ listing, photos }) => (
        <ListingCard key={listing.id} listing={listing} photo={photos[0]} />
      ))}
    </div>
  );
}