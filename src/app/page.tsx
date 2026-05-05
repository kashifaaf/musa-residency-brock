import Link from "next/link"
import { auth } from "@/lib/auth"
import { SearchForm } from "@/components/SearchForm"
import { FeaturedHomes } from "@/components/FeaturedHomes"
import { Header } from "@/components/Header"

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                Exchange Homes,<br />
                <span className="text-orange-600">Exchange Creativity</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with artists worldwide through authentic home exchanges designed for creative minds. 
                Find inspiring spaces that support your artistic practice.
              </p>
              
              {!session && (
                <div className="mt-8">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    Start Your Creative Journey
                  </Link>
                </div>
              )}
            </div>

            {session && (
              <div className="mt-12">
                <SearchForm />
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                Built for Creative Minds
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                More than accommodation - find spaces that inspire
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Artist Community</h3>
                <p className="text-gray-600">Connect with verified artists and creatives who understand the importance of inspiring spaces.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Creative Spaces</h3>
                <p className="text-gray-600">Find homes with studios, natural light, and amenities that support your artistic practice.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Stays</h3>
                <p className="text-gray-600">All hosts and spaces are verified with quick 24-hour approval process for peace of mind.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Homes */}
        {session && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured Creative Spaces
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Discover inspiring homes from our artist community
                </p>
              </div>
              <FeaturedHomes />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-orange-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Share Your Creative Space?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join our community of artists and start hosting fellow creatives from around the world.
            </p>
            {session ? (
              <Link
                href="/host"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 transition-colors"
              >
                List Your Space
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-orange-600 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}