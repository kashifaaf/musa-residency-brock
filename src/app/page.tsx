import { SearchForm } from "@/components/SearchForm"
import { HomeCard } from "@/components/HomeCard"
import { db } from "@/lib/db"
import { homes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function HomePage() {
  const featuredHomes = await db
    .select()
    .from(homes)
    .where(eq(homes.isActive, true))
    .limit(6)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Find Your Next
          <span className="text-red-500"> Creative Space</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with artists worldwide through our specialized home exchange platform. 
          Discover inspiring spaces that support your creative practice.
        </p>
        <SearchForm />
      </section>

      {/* Featured Homes */}
      {featuredHomes.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Homes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHomes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Musa Residency Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Your Space</h3>
            <p className="text-gray-600">Search through curated homes and creative spaces that inspire artistic work.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Hosts</h3>
            <p className="text-gray-600">Submit booking requests and get approved within 24 hours by fellow artists.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create & Connect</h3>
            <p className="text-gray-600">Immerse yourself in new creative environments and local art communities.</p>
          </div>
        </div>
      </section>
    </div>
  )
}