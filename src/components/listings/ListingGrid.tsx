import { getDb } from "@/lib/db";
import { listings, listingPhotos, users, availability } from "@/lib/db/schema";
import { eq, and, or, ilike, gte, lte, sql } from "drizzle-orm";
import { ListingCard } from "./ListingCard";
import type { ListingWithRelations } from "@/types";

interface ListingGridProps {
  searchParams: Promise<{
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export async function ListingGrid({ searchParams }: ListingGridProps) {
  const params = await searchParams;
  const db = getDb();

  // Build the where clause
  const whereConditions = [eq(listings.status, "published")];

  if (params.location) {
    whereConditions.push(
      or(
        ilike(listings.city, `%${params.location}%`),
        ilike(listings.country, `%${params.location}%`)
      )!
    );
  }

  if (params.guests) {
    whereConditions.push(gte(listings.maxGuests, parseInt(params.guests)));
  }

  // Get listings with basic filters
  const listingsData = await db
    .select({
      listing: listings,
      host: users,
      photo: listingPhotos,
    })
    .from(listings)
    .leftJoin(users, eq(listings.hostId, users.id))
    .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
    .where(and(...whereConditions));

  // Group by listing
  const groupedListings = new Map<string, ListingWithRelations>();

  listingsData.forEach((row) => {
    if (!row.host) return;

    const id = row.listing.id;
    if (!groupedListings.has(id)) {
      groupedListings.set(id, {
        ...row.listing,
        host: row.host,
        photos: [],
      });
    }

    if (row.photo) {
      groupedListings.get(id)!.photos.push(row.photo);
    }
  });

  // If date filters are provided, check availability
  let finalListings = Array.from(groupedListings.values());

  if (params.checkIn && params.checkOut) {
    const checkIn = new Date(params.checkIn);
    const checkOut = new Date(params.checkOut);

    // Get availability for all listings
    const availabilityData = await db
      .select()
      .from(availability)
      .where(
        and(
          gte(availability.endDate, checkIn),
          lte(availability.startDate, checkOut)
        )
      );

    // Filter listings based on availability
    finalListings = finalListings.filter((listing) => {
      const listingAvailability = availabilityData.filter(
        (a) => a.listingId === listing.id
      );

      // Check if any availability period covers the requested dates
      return listingAvailability.some(
        (a) =>
          a.startDate <= checkIn &&
          a.endDate >= checkOut &&
          !a.isBlocked
      );
    });
  }

  // Sort photos by order
  finalListings = finalListings.map((listing) => ({
    ...listing,
    photos: listing.photos.sort((a, b) => a.order - b.order),
  }));

  if (finalListings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No listings found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {finalListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}