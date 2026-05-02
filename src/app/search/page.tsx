import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';

interface SearchPageProps {
  searchParams: {
    location?: string;
    startDate?: string;
    endDate?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Find Your Perfect Creative Space
        </h1>
        <p className="mt-2 text-gray-600">
          Discover inspiring homes from our community of artists and creators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters initialFilters={searchParams} />
        </div>
        
        <div className="lg:col-span-3">
          <SearchResults searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}