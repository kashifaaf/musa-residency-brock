"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/SearchBar";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Exchange homes with creative minds worldwide
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with artists and remote workers for authentic stays in inspiring spaces
          </p>
          
          <div className="mb-8">
            <SearchBar />
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/listings">Browse Homes</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/host/become-a-host">List Your Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}