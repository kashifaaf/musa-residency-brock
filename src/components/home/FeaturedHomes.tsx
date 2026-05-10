import { getDb } from "@/lib/db";
import { homes, homeImages, users } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";

export async function FeaturedHomes() {
  const db = getDb();

  // Get published homes with at least one image
  const featuredHomes = await db
    .select({
      home: homes,
      image: homeImages,
      owner: users,
    })
    .from(homes)
    .leftJoin(homeImages, and(eq(homeImages.homeId, homes.id), eq(homeImages.order, 0)))
    .leftJoin(users, eq(users.id, homes.userId))
    .where(eq(homes.isPublished, true))
    .limit(6);

  // Group by home to get unique homes
  const uniqueHomes = featuredHomes.reduce((acc, row) => {
    if (!acc.find(h => h.home.id === row.home.id)) {
      acc.push(row);
    }
    return acc;
  }, [] as typeof featuredHomes);

  if (uniqueHomes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No homes available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {uniqueHomes.map(({ home, image, owner }) => (
        <Link key={home.id} href={`/homes/${home.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] relative">
              {image ? (
                <Image
                  src={image.url}
                  alt={home.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{home.title}</h3>
              <p className="text-sm text-muted-foreground">
                {home.city}, {home.country}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm">
                  {home.bedrooms} bed • {home.bathrooms} bath
                </p>
                <p className="text-sm">
                  Up to {home.maxGuests} guests
                </p>
              </div>
              {owner?.isArtist && (
                <p className="mt-2 text-xs text-primary">
                  Hosted by {owner.artistType || "artist"}
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}