import { Suspense } from "react";
import { ListingSearch } from "@/components/listings/ListingSearch";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ListingCardSkeleton } from "@/components/listings/ListingCard";

// Force dynamic rendering since this page uses searchParams
export const dynamic = 'force-dynamic';

export default function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}) {
  return (
    <div className="min-h-screen">
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Find your next creative stay</h1>
          <Suspense>
            <ListingSearch />
          </Suspense>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        }>
          <ListingGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}