import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ListingCardSkeleton } from "@/components/listings/ListingCard";

// Force dynamic rendering to avoid database queries during static generation
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Creative Spaces</h2>
            <p className="text-muted-foreground">
              Discover unique homes from our community of artists and creators
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <FeaturedListings />
      </Suspense>
      <HowItWorks />
    </main>
  );
}