import { getDb } from "@/lib/db";
import { homes, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { HomeCard } from "@/components/homes/HomeCard";

export async function FeaturedHomes() {
  const db = getDb();
  
  // Get featured homes (active homes with limit)
  const featuredHomes = await db
    .select({
      home: homes,
      host: users,
    })
    .from(homes)
    .leftJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.isActive, true))
    .limit(6);

  if (featuredHomes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-600">No homes available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredHomes.map(({ home, host }) => (
        <HomeCard 
          key={home.id} 
          home={home} 
          host={host!}
        />
      ))}
    </div>
  );
}