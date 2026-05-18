"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { ListingPhoto } from "@/types"

export function PhotoGallery({ photos }: { photos: ListingPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!photos.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        No photos available
      </div>
    )
  }

  const primaryPhoto = photos[0]
  const secondaryPhotos = photos.slice(1, 5)

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2 rounded-xl overflow-hidden">
        <div
          className="relative sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto cursor-pointer"
          onClick={() => setLightboxIndex(0)}
        >
          <Image
            src={primaryPhoto.url}
            alt={primaryPhoto.caption || "Listing photo"}
            fill
            className="object-cover hover:brightness-95 transition-all"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        {secondaryPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            className="relative hidden sm:block aspect-[4/3] cursor-pointer"
            onClick={() => setLightboxIndex(idx + 1)}
          >
            <Image
              src={photo.url}
              alt={photo.caption || `Photo ${idx + 2}`}
              fill
              className="object-cover hover:brightness-95 transition-all"
              sizes="25vw"
            />
            {idx === secondaryPhotos.length - 1 && photos.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold text-lg">
                +{photos.length - 5} more
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() =>
              setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : photos.length - 1)
            }
            className="absolute left-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() =>
              setLightboxIndex(lightboxIndex < photos.length - 1 ? lightboxIndex + 1 : 0)
            }
            className="absolute right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || "Photo"}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <div className="absolute bottom-6 text-sm text-white/80">
            {lightboxIndex + 1} / {photos.length}
            {photos[lightboxIndex].caption && (
              <span className="ml-3">{photos[lightboxIndex].caption}</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}