import { SearchResults } from "@/components/SearchResults"
import { SearchFilters } from "@/components/SearchFilters"
import type { SearchFilters as SearchFiltersType } from "@/lib/types"

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  
  const filters: SearchFiltersType = {
    location: typeof params.location === "string" ? params.location : undefined,
    checkIn: typeof params.checkIn === "string" ? params.checkIn : undefined,
    checkOut: typeof params.checkOut === "string" ? params.checkOut : undefined,
    guests: typeof params.guests === "string" ? parseInt(params.guests) : undefined,
    minPrice: typeof params.minPrice === "string" ? parseInt(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === "string" ? parseInt(params.maxPrice) : undefined,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <SearchFilters initialFilters={filters} />
        </aside>
        
        <main className="lg:col-span-3">
          <SearchResults filters={filters} />
        </main>
      </div>
    </div>
  )
}