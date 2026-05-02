import { getSearchResults } from '@/lib/actions/search';
import { HomeCard } from '@/components/homes/HomeCard';

interface SearchResultsProps {
  searchParams: {
    location?: string;
    startDate?: string;
    endDate?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const result = await getSearchResults(searchParams);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading search results: {result.error}</p>
      </div>
    );
  }

  const { homes, total } = result.data;

  if (homes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No homes found</h3>
        <p className="text-gray-600 mt-2">
          Try adjusting your search criteria to find more options.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">
          {total} {total === 1 ? 'home' : 'homes'} found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((home) => (
          <HomeCard key={home.id} home={home} />
        ))}
      </div>
    </div>
  );
}