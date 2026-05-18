import { notFound } from "next/navigation"
import Image from "next/image"
import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PhotoGallery } from "@/components/PhotoGallery"
import { BookingCard } from "@/components/BookingCard"
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Home,
  Wifi,
  Palette,
  BookOpen,
} from "lucide-react"
import type { ListingWithHost } from "@/types"

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let listing: ListingWithHost | null = null
  try {
    const result = await db.query.listings.findFirst({
      where: eq(listings.id, id),
      with: {
        photos: {
          orderBy: (photos, { asc }) => [asc(photos.sortOrder)],
        },
        host: {
          columns: { id: true, name: true, image: true, bio: true, location: true },
        },
      },
    })
    listing = result as ListingWithHost | null
  } catch {
    notFound()
  }

  if (!listing) notFound()

  const amenities: string[] = listing.amenities ? JSON.parse(listing.amenities) : []
  const creativeAmenities: string[] = listing.creativeAmenities
    ? JSON.parse(listing.creativeAmenities)
    : []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Photo Gallery */}
          <PhotoGallery photos={listing.photos} />

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            {/* Main Content */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {listing.title}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {listing.city}
                      {listing.state ? `, ${listing.state}` : ""}, {listing.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 flex flex-wrap gap-6 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="h-4 w-4 text-primary-500" />
                  <span className="capitalize">{listing.propertyType || "Home"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BedDouble className="h-4 w-4 text-primary-500" />
                  <span>
                    {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bath className="h-4 w-4 text-primary-500" />
                  <span>
                    {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-primary-500" />
                  <span>
                    Up to {listing.maxGuests} guest{(listing.maxGuests || 2) !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Host Info */}
              {listing.host && (
                <div className="mt-6 flex items-center gap-4 border-b border-gray-100 pb-6">
                  {listing.host.image ? (
                    <Image
                      src={listing.host.image}
                      alt={listing.host.name || "Host"}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                      {listing.host.name?.charAt(0) || "H"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">Hosted by {listing.host.name}</p>
                    {listing.host.location && (
                      <p className="text-sm text-gray-500">{listing.host.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <div className="mt-6 border-b border-gray-100 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About this space</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mt-6 border-b border-gray-100 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-primary-500" />
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creative Amenities */}
              {creativeAmenities.length > 0 && (
                <div className="mt-6 border-b border-gray-100 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-accent-500" />
                    Creative Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {creativeAmenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {listing.houseRules && (
                <div className="mt-6 border-b border-gray-100 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary-500" />
                    House Rules
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {listing.houseRules}
                  </p>
                </div>
              )}

              {/* Stay info */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Stay Details</h2>
                <div className="flex gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-900">Minimum stay: </span>
                    {listing.minimumStay || 1} night{(listing.minimumStay || 1) > 1 ? "s" : ""}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Maximum stay: </span>
                    {listing.maximumStay || 365} nights
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:mt-0 mt-8">
              <BookingCard listing={listing} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}