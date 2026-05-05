import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import type { Home } from "@/types"

interface HomeCardProps {
  home: Home
  host: {
    name: string | null
    image: string | null
  } | null
}

export function HomeCard({ home, host }: HomeCardProps) {
  const firstImage = home.images?.[0] || "/placeholder-home.jpg"

  return (
    <Link href={`/homes/${home.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gray-200 relative">
          <img
            src={firstImage}
            alt={home.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-home.jpg"
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{home.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{home.location}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {home.maxGuests} guests • {home.bedrooms} bedrooms • {home.bathrooms} bathrooms
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {host?.image && (
                <img
                  src={host.image}
                  alt={host.name || "Host"}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm text-gray-600">{host?.name || "Host"}</span>
            </div>
            <div className="text-lg font-semibold text-primary-600">
              {formatCurrency(home.pricePerNight)}/night
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}