import Image from "next/image"
import { MapPin, Users, Bed, Bath, Wifi, Car, Coffee } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { HomeWithHost } from "@/lib/types"

interface HomeDetailsProps {
  home: HomeWithHost
}

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  kitchen: Coffee,
}

export function HomeDetails({ home }: HomeDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {home.photos?.slice(0, 4).map((photo, index) => (
          <div key={index} className={`${index === 0 ? 'md:row-span-2' : ''} aspect-square relative rounded-lg overflow-hidden`}>
            <Image
              src={photo}
              alt={`${home.title} - Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* Title and Basic Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{home.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{home.city}, {home.country}</span>
        </div>
        
        <div className="flex items-center space-x-6 text-gray-600">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-1" />
            <span>{home.maxGuests} guests</span>
          </div>
          <div className="flex items-center">
            <Bed className="w-5 h-5 mr-1" />
            <span>{home.bedrooms} bedrooms</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-5 h-5 mr-1" />
            <span>{home.bathrooms} bathrooms</span>
          </div>
        </div>
      </div>

      {/* Host Info */}
      <div className="border-t border-b border-gray-200 py-6">
        <div className="flex items-center">
          {home.host.image && (
            <Image
              src={home.host.image}
              alt={home.host.name}
              width={48}
              height={48}
              className="rounded-full mr-4"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Hosted by {home.host.name}
            </h3>
            {home.host.location && (
              <p className="text-gray-600">{home.host.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About this space</h2>
        <p className="text-gray-700 leading-relaxed">{home.description}</p>
      </div>

      {/* Amenities */}
      {home.amenities && home.amenities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {home.amenities.map((amenity) => {
              const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons]
              return (
                <div key={amenity} className="flex items-center">
                  {IconComponent && <IconComponent className="w-5 h-5 mr-2 text-gray-600" />}
                  <span className="text-gray-700 capitalize">{amenity}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}