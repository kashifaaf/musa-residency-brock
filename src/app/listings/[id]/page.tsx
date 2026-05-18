import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { PhotoGallery } from "@/components/PhotoGallery"
import { BookingRequestForm } from "@/components/BookingRequestForm"
import { formatCurrency, formatDate } from "@/lib/utils"
import { MapPin, Users, BedDouble, Bath, Clock, Wifi, Palette } from "lucide-react"

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, id),
    with: {
      photos: true,
      host: {
        columns: { id: true, name: true, image: true, location: true, bio: true, workInfo: true },
      },
      availability: true,
    },
  })

  if (!listing || !listing.isPublished) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const isOwnListing = session?.user?.id === listing.hostId

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <PhotoGallery photos={listing.photos} />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{listing.title}</h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground">
                  <span className="flex items-center gap-1"><BedDouble className="h-4 w-4 text-muted-foreground" /> {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-muted-foreground" /> {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground" /> Up to {listing.maxGuests} guest{listing.maxGuests !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-muted-foreground" /> Min {listing.minStayNights} nights</span>
                </div>
              </div>

              {/* Host */}
              <div className="rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground">Hosted by {listing.host.name}</h2>
                <div className="mt-3 flex items-start gap-4">
                  {listing.host.image ? (
                    <img src={listing.host.image} alt="" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-medium">
                      {listing.host.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    {listing.host.location && (
                      <p className="text-sm text-muted-foreground">{listing.host.location}</p>
                    )}
                    {listing.host.bio && (
                      <p className="mt-1 text-sm text-foreground">{listing.host.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-foreground">About this space</h2>
                <p className="mt-3 whitespace-pre-line text-foreground leading-relaxed">{listing.description}</p>
              </div>

              {/* Amenities */}
              {((listing.amenities as string[])?.length > 0 || (listing.creativeAmenities as string[])?.length > 0) && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
                  {(listing.amenities as string[])?.length > 0 && (
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Wifi className="h-3.5 w-3.5" /> General
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(listing.amenities as string[]).map((a) => (
                          <span key={a} className="rounded-full border border-border bg-muted px-3 py-1 text-sm">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(listing.creativeAmenities as string[])?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Palette className="h-3.5 w-3.5" /> Creative
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(listing.creativeAmenities as string[]).map((a) => (
                          <span key={a} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* House Rules */}
              {listing.houseRules && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">House Rules</h2>
                  <p className="mt-3 whitespace-pre-line text-sm text-foreground">{listing.houseRules}</p>
                </div>
              )}

              {/* Availability */}
              {listing.availability.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Availability</h2>
                  <div className="mt-3 space-y-2">
                    {listing.availability
                      .filter((a) => a.isAvailable)
                      .map((a) => (
                        <div key={a.id} className="flex items-center gap-2 text-sm text-foreground">
                          <div className="h-2 w-2 rounded-full bg-success" />
                          {formatDate(a.startDate)} — {formatDate(a.endDate)}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(listing.pricePerNight * 100)}
                  <span className="text-base font-normal text-muted-foreground"> / night</span>
                </div>
                {isOwnListing ? (
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    This is your listing.{" "}
                    <a href={`/listings/${listing.id}/edit`} className="text-accent hover:underline">
                      Edit it
                    </a>
                  </div>
                ) : session?.user ? (
                  <BookingRequestForm
                    listingId={listing.id}
                    pricePerNight={listing.pricePerNight}
                    minStayNights={listing.minStayNights}
                  />
                ) : (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Sign in to request a booking</p>
                    <a
                      href="/auth/signin"
                      className="inline-block w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground text-center hover:bg-accent/90 transition-colors"
                    >
                      Sign In
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}