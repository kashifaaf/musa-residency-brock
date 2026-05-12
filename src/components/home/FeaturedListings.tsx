import { getDb } from "@/lib/db";
import { listings, listingPhotos, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingWithRelations } from "@/types";

export async function FeaturedListings() {
  try {
    const db = getDb();
    
    const listingsData = await db
      .select({
        listing: listings,
        host: users,
        photo: listingPhotos,
      })
      .from(listings)
      .leftJoin(users, eq(listings.hostId, users.id))
      .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
      .where(eq(listings.status, "published"))
      .orderBy(desc(listings.createdAt))
      .limit(30);

    // Group by listing
    const groupedListings = new Map<string, ListingWithRelations>();
    
    listingsData.forEach(row => {
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

    const featuredListings = Array.from(groupedListings.values())
      .slice(0, 6)
      .map(listing => ({
        ...listing,
        photos: listing.photos.sort((a, b) => a.order - b.order),
      }));

    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Creative Spaces</h2>
          <p className="text-muted-foreground">
            Discover unique homes from our community of artists and creators
          </p>
        </div>
        
        {featuredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    );
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Creative Spaces</h2>
          <p className="text-muted-foreground">
            Discover unique homes from our community of artists and creators
          </p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Featured listings will appear here once the database is set up.
          </p>
        </div>
      </section>
    );
  }
}