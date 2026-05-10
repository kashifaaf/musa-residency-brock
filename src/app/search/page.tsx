import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/search/SearchFilters";

interface SearchPageProps {
  searchParams: Promise<{
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Find Your Next Creative Stay</h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <SearchFilters initialFilters={params} />
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading homes...</div>}>
              <SearchResults filters={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}