import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { homes, users, availability } from "@/lib/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"
import { formatCurrency } from "@/lib/utils"
import { MapPin, Users, Bed, Bath, Wifi, Car, Kitchen, Tv } from "lucide-react"
import { BookingRequestForm } from "@/components/BookingRequestForm"

interface HomePageProps {
  params: Promise<{ id: string }>
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={20} />,
  parking: <Car size={20} />,
  kitchen: <Kitchen size={20} />,
  tv: <Tv size={20} />,
}

export default async function HomePage({ params }: HomePageProps) {
  const { id } = await params
  const session = await auth()
  
  const homeResult = await db
    .select({
      home: homes,
      host: users,
    })
    .from(homes)
    .leftJoin(users, eq(homes.hostId, users.id))
    .where(and(eq(homes.id, id), eq(homes.isActive, true)))
    .limit(1)
  
  if (!homeResult.length) {
    notFound()
  }
  
  const { home, host } = homeResult[0]
  
  if (!host) {
    notFound()
  }
  
  // Check if current user is the host
  const isOwner = session?.user?.id === home.hostId
  
  // Get availability for the next 3 months
  const today = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  
  const availabilityPeriods = await db
    .select()
    .from(availability)
    .where(
      and(
        eq(availability.homeId, home.id),
        eq(availability.isAvailable, true),
        gte(availability.endDate, today),
        lte(availability.startDate, threeMonthsFromNow)
      )
    )

  if (!session && !isOwner) {
    redirect("/auth/signin")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image
                    src={home.images[0] || "/placeholder-home.jpg"}
                    alt={home.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="hidden md:block space-y-4">
                {home.images.slice(1, 3).map((image, index) => (
                  <div key={index} className="relative h-36 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${home.title} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Title and Basic Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{home.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={20} className="mr-2" />
              {home.location}
            </div>
            
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Users size={20} className="mr-2" />
                {home.maxGuests} guests
              </div>
              <div className="flex items-center">
                <Bed size={20} className="mr-2" />
                {home.bedrooms} bedrooms
              </div>
              <div className="flex items-center">
                <Bath size={20} className="mr-2" />
                {home.bathrooms} bathrooms
              </div>
            </div>
          </div>
          
          {/* Host Info */}
          <div className="border-t border-gray-200 py-6 mb-6">
            <div className="flex items-center space-x-4">
              {host.image ? (
                <img
                  src={host.image}
                  alt={host.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users size={24} />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">Hosted by {host.name}</h3>
                {host.bio && <p className="text-gray-600 text-sm">{host.bio}</p>}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="border-t border-gray-200 py-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this space</h2>
            <p className="text-gray-600 whitespace-pre-line">{home.description}</p>
          </div>
          
          {/* Amenities */}
          {home.amenities && home.amenities.length > 0 && (
            <div className="border-t border-gray-200 py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {home.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {amenityIcons[amenity.toLowerCase()] || <div className="w-5 h-5" />}
                    <span className="text-gray-700 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          {!isOwner && (
            <div className="sticky top-8">
              <BookingRequestForm 
                home={home} 
                availabilityPeriods={availabilityPeriods}
              />
            </div>
          )}
          
          {isOwner && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This is your listing</h3>
              <p className="text-gray-600 mb-4">
                You can manage your home's availability and bookings from your dashboard.
              </p>
              <a
                href="/host/homes"
                className="block w-full bg-red-500 text-white text-center py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Manage Listing
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}