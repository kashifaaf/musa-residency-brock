import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { homes, users, availability } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { HomeGallery } from "@/components/homes/HomeGallery";
import { HomeDetails } from "@/components/homes/HomeDetails";
import { BookingCard } from "@/components/homes/BookingCard";
import { HostInfo } from "@/components/homes/HostInfo";

export default async function HomeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const db = getDb();
  
  // Fetch home with host info
  const result = await db
    .select({
      home: homes,
      host: users,
    })
    .from(homes)
    .leftJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.id, params.id))
    .limit(1);

  if (!result[0] || !result[0].host) {
    notFound();
  }

  const { home, host } = result[0];

  // Fetch availability for the next 6 months
  const now = new Date();
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  const availabilityData = await db
    .select()
    .from(availability)
    .where(
      and(
        eq(availability.homeId, home.id),
        gte(availability.startDate, now),
        lte(availability.startDate, sixMonthsLater)
      )
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HomeGallery home={home} />
        
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HomeDetails home={home} />
            <div className="mt-8">
              <HostInfo host={host} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingCard 
                home={home} 
                availability={availabilityData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}