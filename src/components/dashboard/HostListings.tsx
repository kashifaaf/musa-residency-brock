import { getDb } from "@/lib/db";
import { listings, listingPhotos } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ListingManagementCard } from "./ListingManagementCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface HostListingsProps {
  userId: string;
}

export async function HostListings({ userId }: HostListingsProps) {
  const db = getDb();
  
  const userListings = await db
    .select({
      listing: listings,
      photo: listingPhotos,
    })
    .from(listings)
    .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
    .where(eq(listings.hostId, userId))
    .orderBy(desc(listings.createdAt));

  // Group by listing
  const groupedListings = new Map<string, any>();
  
  userListings.forEach(row => {
    const id = row.listing.id;
    if (!groupedListings.has(id)) {
      groupedListings.set(id, {
        ...row.listing,
        photos: [],
      });
    }
    
    if (row.photo && groupedListings.get(id)!.photos.length === 0) {
      groupedListings.get(id)!.photos.push(row.photo);
    }
  });

  const listingsArray = Array.from(groupedListings.values());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Listings</h2>
        <Button asChild>
          <Link href="/host/listings/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {listingsArray.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
          <Button asChild>
            <Link href="/host/listings/new">Create Your First Listing</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {listingsArray.map((listing) => (
            <ListingManagementCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}