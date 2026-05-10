import { Suspense } from 'react';
import { SearchFilters } from '@/components/search/SearchFilters';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { ListingsGridSkeleton } from '@/components/listings/ListingsGridSkeleton';

export default function ListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Creative Spaces</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <SearchFilters />
        </aside>
        
        <main className="lg:col-span-3">
          <Suspense fallback={<ListingsGridSkeleton />}>
            <ListingsGrid searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}