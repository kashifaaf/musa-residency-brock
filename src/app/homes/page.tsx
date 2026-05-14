import { Suspense } from 'react';
import { SearchFilters } from '@/components/search/SearchFilters';
import { HomeGrid } from '@/components/home/HomeGrid';
import { HomeGridSkeleton } from '@/components/home/HomeGridSkeleton';

interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  page?: string;
}

export default async function HomesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Homes</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <SearchFilters />
          </aside>
          
          <main className="lg:col-span-3">
            <Suspense fallback={<HomeGridSkeleton />}>
              <HomeGrid searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}