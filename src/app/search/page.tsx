import { getDb } from '@/lib/db';
import { homes, users, availability } from '@/lib/db/schema';
import { eq, and, gte, lte, ilike } from 'drizzle-orm';
import { SearchForm } from '@/components/search/search-form';
import { SearchResults } from '@/components/search/search-results';
import type { SearchParams } from '@/lib/types';

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const db = getDb();

  let query = db
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
    .where(eq(homes.isActive, true));

  // Apply location filter
  if (params.location) {
    query = query.where(
      and(
        eq(homes.isActive, true),
        ilike(homes.location, `%${params.location}%`)
      )
    );
  }

  // Apply guest count filter
  if (params.guests) {
    const guestCount = parseInt(params.guests);
    query = query.where(
      and(
        eq(homes.isActive, true),
        gte(homes.maxGuests, guestCount)
      )
    );
  }

  const results = await query;

  // Filter by date availability if dates are provided
  let availableHomes = results;
  if (params.startDate && params.endDate) {
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    const availabilityData = await db
      .select({ homeId: availability.homeId })
      .from(availability)
      .where(
        and(
          lte(availability.startDate, startDate),
          gte(availability.endDate, endDate),
          eq(availability.isBooked, false)
        )
      );

    const availableHomeIds = new Set(availabilityData.map(a => a.homeId));
    availableHomes = results.filter(home => availableHomeIds.has(home.id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <SearchForm initialValues={params} />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {availableHomes.length > 0 
              ? `${availableHomes.length} homes found`
              : 'No homes found'
            }
          </h1>
          {params.location && (
            <p className="text-gray-600">in {params.location}</p>
          )}
        </div>
        
        <SearchResults homes={availableHomes} />
      </div>
    </div>
  );
}