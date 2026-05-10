import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { listings, listingPhotos, users, availability } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { ListingDetail } from '@/components/listings/ListingDetail';
import { BookingCard } from '@/components/bookings/BookingCard';
import { HostInfo } from '@/components/listings/HostInfo';

interface ListingPageProps {
  params: { id: string };
  searchParams: { checkIn?: string; checkOut?: string; guests?: string };
}

export default async function ListingPage({ params, searchParams }: ListingPageProps) {
  const db = getDb();
  
  const listing = await db.select({
    listing: listings,
    host: users,
  })
  .from(listings)
  .leftJoin(users, eq(listings.hostId, users.id))
  .where(eq(listings.id, params.id))
  .limit(1);

  if (!listing[0]) {
    notFound();
  }

  const photos = await db.select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, params.id))
    .orderBy(listingPhotos.orderIndex);

  // Check availability for requested dates
  let isAvailable = true;
  if (searchParams.checkIn && searchParams.checkOut) {
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    
    const blockedDates = await db.select()
      .from(availability)
      .where(
        and(
          eq(availability.listingId, params.id),
          eq(availability.isBlocked, true),
          lte(availability.startDate, checkOut),
          gte(availability.endDate, checkIn)
        )
      );
    
    isAvailable = blockedDates.length === 0;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <ListingDetail 
          listing={listing[0].listing} 
          photos={photos}
        />
        
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <HostInfo host={listing[0].host!} />
          </div>
          
          <div>
            <BookingCard 
              listing={listing[0].listing}
              isAvailable={isAvailable}
              checkIn={searchParams.checkIn}
              checkOut={searchParams.checkOut}
              guests={searchParams.guests ? parseInt(searchParams.guests) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}