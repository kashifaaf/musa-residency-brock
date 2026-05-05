import { getDb } from '@/lib/db';
import { homes, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HomeCard } from '@/components/homes/home-card';

export async function FeaturedHomes() {
  const db = getDb();
  
  const featuredHomes = await db
    .select({
      id: homes.id,
      hostId: homes.hostId,
      title: homes.title,
      description: homes.description,
      location: homes.location,
      pricePerNight: homes.pricePerNight,
      bedrooms: homes.bedrooms,
      bathrooms: homes.bathrooms,
      maxGuests: homes.maxGuests,
      amenities: homes.amenities,
      photos: homes.photos,
      isActive: homes.isActive,
      createdAt: homes.createdAt,
      updatedAt: homes.updatedAt,
      host: {
        id: users.id,
        name: users.name,
        profilePhoto: users.profilePhoto,
      },
    })
    .from(homes)
    .innerJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.isActive, true))
    .limit(6);

  if (featuredHomes.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Homes</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover unique spaces from our creative community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHomes.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      </div>
    </section>
  );
}