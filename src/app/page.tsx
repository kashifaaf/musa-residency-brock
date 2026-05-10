import { Suspense } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { SearchForm } from '@/components/search/SearchForm';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80')] bg-cover bg-center" />
        
        <div className="relative z-20 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="mb-6 text-5xl md:text-6xl font-bold">
            Exchange Homes with Creatives Worldwide
          </h1>
          <p className="mb-8 text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Stay in inspiring spaces. Connect with artists. Create anywhere.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <SearchForm />
          </div>
          
          <div className="mt-8 flex gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur">
              <Link href="/listings/new">List Your Space</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Space</h3>
              <p className="text-muted-foreground">
                Search available homes in creative communities worldwide
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Book</h3>
              <p className="text-muted-foreground">
                Request stays with verified hosts and get responses within 24 hours
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay & Create</h3>
              <p className="text-muted-foreground">
                Experience new cultures and find inspiration in creative spaces
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Creative Spaces</h2>
          <Suspense fallback={<div className="grid md:grid-cols-3 gap-6 animate-pulse">{[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-muted rounded-lg" />)}</div>}>
            <FeaturedListings />
          </Suspense>
        </div>
      </section>
    </>
  );
}