'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Home, User } from '@/lib/db/schema'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { BookingRequestModal } from '@/components/booking/BookingRequestModal'
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Briefcase,
  Palette,
  Calendar,
  Shield
} from 'lucide-react'

interface HomeDetailsProps {
  home: Home
  host: User
}

export function HomeDetails({ home, host }: HomeDetailsProps) {
  const router = useRouter()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const amenityIcons: Record<string, React.ReactNode> = {
    'WiFi': <Wifi className="h-5 w-5" />,
    'Free parking': <Car className="h-5 w-5" />,
    'Dedicated workspace': <Briefcase className="h-5 w-5" />,
  }

  const creativeAmenityIcons: Record<string, React.ReactNode> = {
    'Art studio': <Palette className="h-5 w-5" />,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="relative h-[60vh] bg-gray-100">
        {home.images.length > 0 ? (
          <>
            <Image
              src={home.images[selectedImageIndex] || '/placeholder.jpg'}
              alt={home.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {home.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No photos available
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{home.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{home.city}, {home.country}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex items-center gap-6 pb-8 border-b">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span>{home.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-500" />
                <span>{home.bedrooms} bedroom{home.bedrooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-gray-500" />
                <span>{home.bathrooms} bathroom{home.bathrooms > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Host Info */}
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              {host.image && (
                <Image
                  src={host.image}
                  alt={host.name || 'Host'}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Hosted by {host.name || 'Anonymous Host'}</h3>
                {host.location && (
                  <p className="text-gray-600">{host.location}</p>
                )}
                {host.artisticPractice && (
                  <p className="text-sm text-gray-500 mt-1">{host.artisticPractice}</p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/profile/${host.id}`)}
              >
                View Profile
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About this space</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{home.description}</p>
            </div>

            {/* Amenities */}
            {home.amenities && home.amenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {home.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      {amenityIcons[amenity] || <div className="w-5 h-5" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Creative Amenities */}
            {home.creativeAmenities && home.creativeAmenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Creative Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {home.creativeAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      {creativeAmenityIcons[amenity] || <Palette className="w-5 h-5" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Art Scene */}
            {home.localArtScene && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Local Art Scene</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{home.localArtScene}</p>
              </div>
            )}

            {/* House Rules */}
            {home.houseRules && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">House Rules</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{home.houseRules}</p>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-semibold">
                    {formatPrice(parseFloat(home.pricePerNight))}
                  </span>
                  <span className="text-gray-600">per night</span>
                </div>
                <p className="text-sm text-gray-500">
                  Minimum stay: {home.minimumStay} nights
                </p>
              </div>

              <Button
                size="lg"
                className="w-full mb-4"
                onClick={() => setShowBookingModal(true)}
              >
                Request to Book
              </Button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Host responds within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>

              {home.responseRate && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response rate</span>
                    <span className="font-medium">{home.responseRate}%</span>
                  </div>
                  {home.avgResponseTime && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Response time</span>
                      <span className="font-medium">~{home.avgResponseTime} hours</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingRequestModal
          home={home}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  )
}