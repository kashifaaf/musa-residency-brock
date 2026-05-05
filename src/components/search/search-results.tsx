import { HomeCard } from '@/components/homes/home-card';
import type { Home } from '@/lib/types';

interface SearchResultsProps {
  homes: Array<Home & { host?: { id: string; name: string; profilePhoto?: string } }>;
}

export function SearchResults({ homes }: SearchResultsProps) {
  if (homes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No homes found</h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {homes.map((home) => (
        <HomeCard key={home.id} home={home} />
      ))}
    </div>
  );
}