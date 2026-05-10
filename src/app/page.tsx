import { Suspense } from "react";
import Link from "next/link";
import { validateRequest } from "@/lib/auth/session";
import { HomeSearchForm } from "@/components/home/HomeSearchForm";
import { FeaturedHomes } from "@/components/home/FeaturedHomes";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const { user } = await validateRequest();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-transparent px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Find Your Creative Home Away From Home
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Connect with artists worldwide through curated home exchanges. 
              Stay in inspiring spaces while sharing your own creative sanctuary.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link href="/homes/new">
                  <Button size="lg">List Your Home</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <HomeSearchForm />
        </div>
      </section>

      {/* Featured Homes */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Featured Creative Spaces</h2>
          <Suspense fallback={<div>Loading featured homes...</div>}>
            <FeaturedHomes />
          </Suspense>
        </div>
      </section>
    </div>
  );
}