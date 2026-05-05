import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, Bed, Bath } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { HomeWithHost } from "@/lib/types"

interface HomeCardProps {
  home: HomeWithHost
}

export function HomeCard({ home }: HomeCardProps) {
  const mainPhoto = home.photos?.[0] || "/placeholder-home.jpg"
  
  return (
    <Link href={`/homes/${home.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow group-hover:shadow-lg">
        <div className="aspect-video relative">
          <Image
            src={mainPhoto}
            alt={home.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {home.title}
            </h3>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(home.pricePerNight)}
              <span className="text-sm font-normal text-gray-500">/night</span>
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{home.city}, {home.country}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{home.maxGuests} guests</span>
            </div>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{home.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{home.bathrooms} bath</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {home.host.image && (
              <Image
                src={home.host.image}
                alt={home.host.name}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
            )}
            <span className="text-sm text-gray-600">
              Hosted by {home.host.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}