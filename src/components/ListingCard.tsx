import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"
import { MapPin, Users, BedDouble, Bath } from "lucide-react"
import type { ListingWithHost } from "@/types"

export function ListingCard({ listing }: { listing: ListingWithHost }) {
  const coverPhoto = listing.photos?.[0]?.url

  return (
    <Link
      href={ROUTES.listing(listing.id)}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <BedDouble className="h-12 w-12" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
          {formatCurrency(listing.pricePerNight * 100)} / night
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground line-clamp-1">{listing.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{listing.city}, {listing.country}</span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {listing.maxGuests} guest{listing.maxGuests !== 1 ? "s" : ""}</span>
        </div>
        {listing.host && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            {listing.host.image ? (
              <img src={listing.host.image} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {listing.host.name?.charAt(0) || "?"}
              </div>
            )}
            <span className="text-xs text-muted-foreground">{listing.host.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}