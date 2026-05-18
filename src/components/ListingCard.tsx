"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, BedDouble, Bath } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { ListingWithHost } from "@/types"

export function ListingCard({ listing }: { listing: ListingWithHost }) {
  const primaryPhoto = listing.photos?.[0]

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <BedDouble className="h-12 w-12" />
          </div>
        )}
        <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(Number(listing.pricePerNight), listing.currency || "USD")}
          </span>
          <span className="text-xs text-gray-500"> / night</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
          {listing.title}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {listing.city}, {listing.country}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{listing.maxGuests} guest{listing.maxGuests !== 1 ? "s" : ""}</span>
          </div>
        </div>
        {listing.host && (
          <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
            {listing.host.image ? (
              <Image
                src={listing.host.image}
                alt={listing.host.name || "Host"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                {listing.host.name?.charAt(0) || "H"}
              </div>
            )}
            <span className="text-xs text-gray-500">
              Hosted by {listing.host.name?.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}