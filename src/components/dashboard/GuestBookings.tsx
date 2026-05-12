import { getDb } from "@/lib/db";
import { bookings, listings, users, listingPhotos } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { BookingCard } from "./BookingCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GuestBookingsProps {
  userId: string;
}

export async function GuestBookings({ userId }: GuestBookingsProps) {
  const db = getDb();
  
  const userBookings = await db
    .select({
      booking: bookings,
      listing: listings,
      host: users,
      photo: listingPhotos,
    })
    .from(bookings)
    .leftJoin(listings, eq(bookings.listingId, listings.id))
    .leftJoin(users, eq(bookings.hostId, users.id))
    .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
    .where(eq(bookings.guestId, userId))
    .orderBy(desc(bookings.createdAt));

  // Group by booking
  const groupedBookings = new Map<string, any>();
  
  userBookings.forEach(row => {
    if (!row.listing || !row.host) return;
    
    const id = row.booking.id;
    if (!groupedBookings.has(id)) {
      groupedBookings.set(id, {
        ...row.booking,
        listing: {
          ...row.listing,
          photos: [],
        },
        host: row.host,
      });
    }
    
    if (row.photo && groupedBookings.get(id)!.listing.photos.length === 0) {
      groupedBookings.get(id)!.listing.photos.push(row.photo);
    }
  });

  const bookingsArray = Array.from(groupedBookings.values());

  if (bookingsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't booked any trips yet.</p>
        <Button asChild>
          <Link href="/listings">Browse Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookingsArray.map((booking) => (
        <BookingCard key={booking.id} booking={booking} viewAs="guest" />
      ))}
    </div>
  );
}