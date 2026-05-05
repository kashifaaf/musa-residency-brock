import { formatCurrency } from "@/lib/utils"
import type { Home, User } from "@/types"

interface HomeDetailsProps {
  home: Home
  host: User | null
}

export function HomeDetails({ home, host }: HomeDetailsProps) {
  const amenitiesList = home.amenities?.split(",").map(a => a.trim()).filter(Boolean) || []

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {home.images && home.images.length > 0 ? (
          home.images.map((image, index) => (
            <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`${home.title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>

      {/* Home Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{home.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{home.location}</p>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span>{home.maxGuests} guests</span>
          <span>{home.bedrooms} bedrooms</span>
          <span>{home.bathrooms} bathrooms</span>
        </div>
      </div>

      {/* Host Info */}
      {host && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Hosted by {host.name}</h2>
          <div className="flex items-start space-x-4">
            {host.image && (
              <img
                src={host.image}
                alt={host.name || "Host"}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              {host.bio && (
                <p className="text-gray-600 mb-2">{host.bio}</p>
              )}
              {host.location && (
                <p className="text-sm text-gray-500">📍 {host.location}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">About this space</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{home.description}</p>
      </div>

      {/* Amenities */}
      {amenitiesList.length > 0 && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {amenitiesList.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}