import { Suspense } from "react"
import { Header } from "@/components/Header"
import { SearchResults } from "@/components/SearchResults"
import { SearchFilters } from "@/components/SearchFilters"

interface SearchPageProps {
  searchParams?: {
    location?: string
    checkin?: string
    checkout?: string
    guests?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    creativeSpace?: string
    amenities?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Creative Space
          </h1>
          <p className="text-gray-600">
            Discover inspiring homes from our global artist community
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>
          
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-48 md:h-full bg-gray-200"></div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}