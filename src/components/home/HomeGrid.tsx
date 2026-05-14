import { getDb } from '@/lib/db';
import { homes, availability } from '@/lib/db/schema';
import { and, eq, gte, lte, like, or, sql } from 'drizzle-orm';
import { HomeCard } from './HomeCard';
import { Pagination } from '../ui/pagination';
import { PAGINATION } from '@/lib/constants';

interface HomeGridProps {
  searchParams: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    page?: string;
    amenities?: string | string[];
    priceMin?: string;
    priceMax?: string;
  };
}

export async function HomeGrid({ searchParams }: HomeGridProps) {
  const db = getDb();
  const page = Number(searchParams.page) || 1;
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [eq(homes.isActive, true)];

  if (searchParams.location) {
    conditions.push(
      or(
        like(homes.city, `%${searchParams.location}%`),
        like(homes.country, `%${searchParams.location}%`)
      )!
    );
  }

  // Get homes with filters
  const [homesData, totalCount] = await Promise.all([
    db.query.homes.findMany({
      where: and(...conditions),
      with: {
        host: true,
        availability: searchParams.checkIn && searchParams.checkOut ? {
          where: and(
            lte(availability.startDate, new Date(searchParams.checkIn)),
            gte(availability.endDate, new Date(searchParams.checkOut)),
            eq(availability.isAvailable, true)
          ),
        } : undefined,
      },
      orderBy: (homes) => homes.visibilityScore,
      limit: pageSize,
      offset,
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(homes)
      .where(and(...conditions))
      .then(result => Number(result[0].count)),
  ]);

  // Filter homes by availability if dates provided
  const filteredHomes = searchParams.checkIn && searchParams.checkOut
    ? homesData.filter(home => home.availability && home.availability.length > 0)
    : homesData;

  const totalPages = Math.ceil(totalCount / pageSize);

  if (filteredHomes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No homes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHomes.map((home) => (
          <HomeCard key={home.id} home={home} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/homes"
            searchParams={searchParams}
          />
        </div>
      )}
    </div>
  );
}