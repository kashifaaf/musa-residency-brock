import { getDb } from "@/lib/db";
import { homes, users, availability } from "@/lib/db/schema";
import { eq, and, or, ilike, gte, lte, sql } from "drizzle-orm";
import { HomeCard } from "./HomeCard";
import { Pagination } from "@/components/ui/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface HomesListProps {
  searchParams: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    propertyType?: string;
    minBedrooms?: string;
    page?: string;
  };
}

export async function HomesList({ searchParams }: HomesListProps) {
  const db = getDb();
  const page = Number(searchParams.page) || 1;
  const pageSize = DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [eq(homes.isActive, true)];

  if (searchParams.location) {
    conditions.push(
      or(
        ilike(homes.city, `%${searchParams.location}%`),
        ilike(homes.country, `%${searchParams.location}%`)
      )!
    );
  }

  if (searchParams.guests) {
    conditions.push(gte(homes.maxGuests, Number(searchParams.guests)));
  }

  if (searchParams.propertyType) {
    conditions.push(eq(homes.propertyType, searchParams.propertyType));
  }

  if (searchParams.minBedrooms) {
    conditions.push(gte(homes.bedrooms, Number(searchParams.minBedrooms)));
  }

  // Get homes with host info
  const [results, totalCount] = await Promise.all([
    db
      .select({
        home: homes,
        host: users,
      })
      .from(homes)
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(and(...conditions))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(homes)
      .where(and(...conditions))
      .then(result => result[0]?.count ?? 0)
  ]);

  // TODO: Filter by availability dates if provided
  // This would require a more complex query joining with the availability table

  const totalPages = Math.ceil(totalCount / pageSize);

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-600">
          No homes found matching your criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {totalCount} {totalCount === 1 ? "home" : "homes"} available
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {results.map(({ home, host }) => (
          <HomeCard key={home.id} home={home} host={host!} />
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