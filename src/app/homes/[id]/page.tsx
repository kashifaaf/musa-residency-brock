import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { homes, homeImages, users, availability } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/session";
import { HomeImageGallery } from "@/components/homes/HomeImageGallery";
import { HomeBookingCard } from "@/components/homes/HomeBookingCard";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface HomePageProps {
  params: Promise<{ id: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { id } = await params;
  const { user } = await validateRequest();
  const db = getDb();

  // Get home with images and owner
  const homeData = await db
    .select({
      home: homes,
      image: homeImages,
      owner: users,
    })
    .from(homes)
    .leftJoin(homeImages, eq(homeImages.homeId, homes.id))
    .leftJoin(users, eq(users.id, homes.userId))
    .where(eq(homes.id, id));

  if (homeData.length === 0 || !homeData[0].owner) {
    notFound();
  }

  const home = homeData[0].home;
  const owner = homeData[0].owner;
  const images = homeData
    .filter((row) => row.image !== null)
    .map((row) => row.image!)
    .sort((a, b) => a.order - b.order);

  // Get availability for next 6 months
  const now = new Date();
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  const availabilities = await db
    .select()
    .from(availability)
    .where(
      and(
        eq(availability.homeId, id),
        gte(availability.endDate, now),
        lte(availability.startDate, sixMonthsLater)
      )
    );

  const isOwner = user?.id === home.userId;

  return (
    <div className="min-h-screen">
      {/* Image Gallery */}
      <HomeImageGallery images={images} title={home.title} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{home.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {home.city}, {home.country}
              </p>
              {isOwner && (
                <Link href={`/homes/${id}/edit`}>
                  <Button variant="outline" className="mt-4">
                    Edit Listing
                  </Button>
                </Link>
              )}
            </div>

            {/* Host Info */}
            <div className="mb-8 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Hosted by {owner.name || "Artist"}</h2>
              {owner.bio && <p className="text-muted-foreground">{owner.bio}</p>}
              {owner.isArtist && owner.artistType && (
                <p className="mt-2 text-sm">
                  <span className="font-medium">Artist Type:</span> {owner.artistType}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">About this space</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{home.description}</p>
            </div>

            {/* Details */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Space details</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-muted-foreground">{home.homeType}</p>
                </div>
                <div>
                  <p className="font-medium">Bedrooms</p>
                  <p className="text-muted-foreground">{home.bedrooms}</p>
                </div>
                <div>
                  <p className="font-medium">Bathrooms</p>
                  <p className="text-muted-foreground">{home.bathrooms}</p>
                </div>
                <div>
                  <p className="font-medium">Max guests</p>
                  <p className="text-muted-foreground">{home.maxGuests}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {home.amenities && home.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {home.amenities.map((amenity) => (
                    <p key={amenity} className="text-muted-foreground">
                      {amenity.replace(/_/g, " ")}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Creative Amenities */}
            {home.creativeAmenities && home.creativeAmenities.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Creative amenities</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {home.creativeAmenities.map((amenity) => (
                    <p key={amenity} className="text-muted-foreground">
                      {amenity.replace(/_/g, " ")}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {home.houseRules && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">House rules</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">{home.houseRules}</p>
              </div>
            )}

            {/* Local Art Scene */}
            {home.localArtScene && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Local art scene</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">{home.localArtScene}</p>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {!isOwner && user && (
                <HomeBookingCard
                  homeId={home.id}
                  hostId={home.userId}
                  availabilities={availabilities}
                  minStay={7}
                  maxStay={90}
                  maxGuests={home.maxGuests}
                />
              )}
              {!isOwner && !user && (
                <div className="rounded-lg border p-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Sign in to request a booking
                  </p>
                  <Link href="/auth/signin">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </div>
              )}
              {isOwner && (
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Availability</h3>
                  {availabilities.length > 0 ? (
                    <div className="space-y-2">
                      {availabilities.map((avail) => (
                        <div key={avail.id} className="text-sm">
                          <p className="font-medium">
                            {formatDate(avail.startDate)} - {formatDate(avail.endDate)}
                          </p>
                          {avail.pricePerNight && (
                            <p className="text-muted-foreground">
                              ${avail.pricePerNight}/night
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No availability set
                    </p>
                  )}
                  <Link href={`/homes/${id}/availability`}>
                    <Button variant="outline" className="mt-4 w-full">
                      Manage Availability
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}