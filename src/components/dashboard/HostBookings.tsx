import { getDb } from "@/lib/db";
import { bookings, listings, users, listingPhotos } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { BookingCard } from "./BookingCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";
import { isWithin24Hours } from "@/lib/utils";

interface HostBookingsProps {
  userId: string;
}

export async function HostBookings({ userId }: HostBookingsProps) {
  const db = getDb();
  
  const hostBookings = await db
    .select({
      booking: bookings,
      listing: listings,
      guest: users,
      photo: listingPhotos,
    })
    .from(bookings)
    .leftJoin(listings, eq(bookings.listingId, listings.id))
    .leftJoin(users, eq(bookings.guestId, users.id))
    .leftJoin(listingPhotos, eq(listings.id, listingPhotos.listingId))
    .where(eq(bookings.hostId, userId))
    .orderBy(desc(bookings.createdAt));

  // Group by booking
  const groupedBookings = new Map<string, any>();
  
  hostBookings.forEach(row => {
    if (!row.listing || !row.guest) return;
    
    const id = row.booking.id;
    if (!groupedBookings.has(id)) {
      groupedBookings.set(id, {
        ...row.booking,
        listing: {
          ...row.listing,
          photos: [],
        },
        guest: row.guest,
      });
    }
    
    if (row.photo && groupedBookings.get(id)!.listing.photos.length === 0) {
      groupedBookings.get(id)!.listing.photos.push(row.photo);
    }
  });

  const bookingsArray = Array.from(groupedBookings.values());
  const pendingBookings = bookingsArray.filter(
    b => b.status === "pending" && isWithin24Hours(b.createdAt)
  );

  if (bookingsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No booking requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingBookings.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            You have {pendingBookings.length} pending booking{pendingBookings.length !== 1 ? "s" : ""} requiring response.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {bookingsArray.map((booking) => (
          <BookingCard key={booking.id} booking={booking} viewAs="host" />
        ))}
      </div>
    </div>
  );
}