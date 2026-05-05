import Link from "next/link"
import Image from "next/image"
import { Home } from "@/lib/db/schema"
import { formatCurrency } from "@/lib/utils"
import { MapPin, Users, Bed, Bath } from "lucide-react"

interface HomeCardProps {
  home: Home
}

export function HomeCard({ home }: HomeCardProps) {
  return (
    <Link href={`/homes/${home.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow group-hover:shadow-lg">
        <div className="relative h-64">
          <Image
            src={home.images[0] || "/placeholder-home.jpg"}
            alt={home.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            {home.location}
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {home.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {home.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                {home.maxGuests}
              </div>
              <div className="flex items-center">
                <Bed size={16} className="mr-1" />
                {home.bedrooms}
              </div>
              <div className="flex items-center">
                <Bath size={16} className="mr-1" />
                {home.bathrooms}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(Number(home.pricePerNight))}
              </div>
              <div className="text-sm text-gray-600">per night</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}