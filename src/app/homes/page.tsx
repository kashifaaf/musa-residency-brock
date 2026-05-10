import { Suspense } from "react";
import { SearchFilters } from "@/components/homes/SearchFilters";
import { HomesList } from "@/components/homes/HomesList";
import { HomesListSkeleton } from "@/components/homes/HomesListSkeleton";

interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  propertyType?: string;
  minBedrooms?: string;
  page?: string;
}

export default function HomesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Available Homes</h1>
        
        <div className="lg:flex lg:gap-8">
          <aside className="mb-8 lg:mb-0 lg:w-80">
            <SearchFilters />
          </aside>
          
          <main className="lg:flex-1">
            <Suspense fallback={<HomesListSkeleton />}>
              <HomesList searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}