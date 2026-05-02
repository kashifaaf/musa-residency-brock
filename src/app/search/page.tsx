import { getDb } from '@/lib/db';
import { homes, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { SearchForm } from '@/components/SearchForm';
import { HomeCard } from '@/components/HomeCard';
import { HomeWithHost } from '@/lib/types';

interface SearchParams {
  searchParams: {
    location?: string;
    startDate?: string;
    endDate?: string;
    guests?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const db = getDb();
  
  // Get all homes with host information
  const homeResults = await db
    .select({
      home: homes,
      host: {
        id: users.id,
        name: users.name,
        profilePhoto: users.profilePhoto,
      },
    })
    .from(homes)
    .innerJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.isActive, true));

  // Transform the results
  const availableHomes: HomeWithHost[] = homeResults.map((result) => ({
    id: result.home.id,
    title: result.home.title,
    description: result.home.description,
    location: result.home.location,
    maxGuests: result.home.maxGuests,
    amenities: result.home.amenities ? JSON.parse(result.home.amenities) : [],
    photos: result.home.photos ? JSON.parse(result.home.photos) : [],
    host: {
      id: result.host.id,
      name: result.host.name,
      profilePhoto: result.host.profilePhoto,
    },
    availability: [], // TODO: Add availability filtering
  }));

  // Apply basic filters
  let filteredHomes = availableHomes;

  if (searchParams.location) {
    const location = searchParams.location.toLowerCase();
    filteredHomes = filteredHomes.filter(home => 
      home.location.toLowerCase().includes(location)
    );
  }

  if (searchParams.guests) {
    const guestCount = parseInt(searchParams.guests);
    if (!isNaN(guestCount)) {
      filteredHomes = filteredHomes.filter(home => 
        home.maxGuests >= guestCount
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Next Creative Space</h1>
        <p className="mt-2 text-gray-600">
          Discover inspiring homes and studios from fellow artists around the world.
        </p>
      </div>

      <SearchForm />

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredHomes.length} {filteredHomes.length === 1 ? 'home' : 'homes'} available
          </p>
        </div>

        {filteredHomes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">No homes found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHomes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}