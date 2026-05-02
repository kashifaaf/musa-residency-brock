import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Artist Home Exchange
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Connect with fellow artists and exchange homes for creative residencies. 
          Find inspiring spaces that support your artistic practice while exploring new cities.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/search">
            <Button size="lg">Browse Homes</Button>
          </Link>
          <Link href="/host/homes/new">
            <Button variant="outline" size="lg">List Your Home</Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Artist Profiles</h3>
            <p className="mt-2 text-gray-600">
              Detailed profiles showcasing your artistic practice, portfolio, and what you can offer to visiting creatives.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Creative Spaces</h3>
            <p className="mt-2 text-gray-600">
              Find homes with studios, creative amenities, and inspiring environments that support your artistic work.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Cultural Exchange</h3>
            <p className="mt-2 text-gray-600">
              Immerse yourself in local art scenes with recommendations and connections from fellow artists.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">1</div>
            <h3 className="mt-4 font-semibold text-gray-900">Create Your Profile</h3>
            <p className="mt-2 text-gray-600">Share your artistic practice, list your home, and set availability.</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">2</div>
            <h3 className="mt-4 font-semibold text-gray-900">Find & Request</h3>
            <p className="mt-2 text-gray-600">Browse available homes and send booking requests to hosts.</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">3</div>
            <h3 className="mt-4 font-semibold text-gray-900">Create & Connect</h3>
            <p className="mt-2 text-gray-600">Enjoy your residency and connect with the local creative community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}