import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SearchForm } from '@/components/search/SearchForm';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Creative Spaces for
              <span className="text-blue-600"> Artists Worldwide</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Connect with fellow artists and creators through our specialized home exchange platform. 
              Find inspiring spaces that support your creative practice.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/search">
                <Button size="lg">
                  Find Your Next Creative Space
                </Button>
              </Link>
              <Link href="/host">
                <Button variant="outline" size="lg">
                  List Your Space
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Search Available Homes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find the perfect space for your creative retreat
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Musa Residency?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built specifically for the creative community
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H5a2 2 0 01-2-2m0 0V9a2 2 0 012-2h2m0 10v-1a1 1 0 011-1h1m-6 0a1 1 0 011 1v1m0-4h4" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Curated Creative Spaces
              </h3>
              <p className="mt-4 text-gray-600">
                Every home is verified to ensure it provides the right environment for creative work.
              </p>
            </div>

            <div className="card text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Trusted Community
              </h3>
              <p className="mt-4 text-gray-600">
                All hosts and guests are verified artists, ensuring a safe and inspiring community.
              </p>
            </div>

            <div className="card text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Quick Response Guarantee
              </h3>
              <p className="mt-4 text-gray-600">
                Hosts respond within 24 hours or bookings are automatically approved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}