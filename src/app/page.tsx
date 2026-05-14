import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, Users, Shield } from 'lucide-react';
import { SearchForm } from '@/components/search/SearchForm';
import { FeaturedHomes } from '@/components/home/FeaturedHomes';

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Exchange Homes with Creative Minds Worldwide
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with artists and remote workers for authentic home exchanges. 
            Stay in inspiring spaces while sharing your own.
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Musa Residency</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Availability</h3>
              <p className="text-gray-600">
                No phantom listings. Hosts set real dates and respond within 24 hours.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Community</h3>
              <p className="text-gray-600">
                Connect with like-minded creatives and remote workers worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Bookings</h3>
              <p className="text-gray-600">
                Safe payment processing and host approval for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homes */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Homes</h2>
          <FeaturedHomes />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of creative travelers and share your space with the world.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/homes">Browse Homes</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/host">Become a Host</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}