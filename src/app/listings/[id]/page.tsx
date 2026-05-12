import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listings, listingPhotos, users, availability } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { BookingWidget } from "@/components/booking/BookingWidget";
import type { ListingWithRelations } from "@/types";

// Force dynamic rendering since this page uses auth
export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const db = getDb();

  const listingData = await db
    .select({
      listing: listings,
      host: users,
      photo: listingPhotos,
    })
    .from(listings)
    .leftJoin(users, eq(listings.hostId, users.id))
    .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
    .where(and(
      eq(listings.id, id),
      eq(listings.status, "published")
    ));

  if (!listingData.length || !listingData[0].host) {
    notFound();
  }

  // Group photos by listing
  const listing: ListingWithRelations = {
    ...listingData[0].listing,
    host: listingData[0].host,
    photos: listingData
      .filter(d => d.photo)
      .map(d => d.photo!)
      .sort((a, b) => a.order - b.order),
  };

  // Get availability
  const availabilityData = await db
    .select()
    .from(availability)
    .where(and(
      eq(availability.listingId, id),
      gte(availability.endDate, new Date())
    ));

  listing.availability = availabilityData;

  const isOwner = session?.user?.id === listing.hostId;

  return (
    <div className="min-h-screen">
      <ListingDetail listing={listing} />
      {!isOwner && (
        <BookingWidget
          listing={listing}
          userId={session?.user?.id}
        />
      )}
    </div>
  );
}