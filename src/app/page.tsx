import { Hero } from '@/components/landing/hero';
import { SearchForm } from '@/components/search/search-form';
import { FeaturedHomes } from '@/components/landing/featured-homes';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Stay</h2>
          <SearchForm />
        </div>
      </section>
      <FeaturedHomes />
    </main>
  );
}