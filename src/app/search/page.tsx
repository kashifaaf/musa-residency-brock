import { searchHomes } from '@/lib/actions/homes';
import { SearchForm } from '@/components/homes/search-form';
import { HomeCard } from '@/components/homes/home-card';

interface SearchPageProps {
  searchParams: Promise<{
    location?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { location, startDate, endDate } = params;

  const startDateObj = startDate ? new Date(startDate) : undefined;
  const endDateObj = endDate ? new Date(endDate) : undefined;

  const result = await searchHomes(location, startDateObj, endDateObj);
  const homes = result.success ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <SearchForm />
        </div>
      </div>

      {location && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {homes.length} homes found
            {location && ` in "${location}"`}
            {startDate && endDate && ` from ${startDate} to ${endDate}`}
          </h2>
        </div>
      )}

      {homes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No homes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse all available homes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      )}
    </div>
  );
}