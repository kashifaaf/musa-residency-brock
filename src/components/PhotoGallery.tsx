"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { ListingPhoto } from "@/types"

export function PhotoGallery({ photos }: { photos: ListingPhoto[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos.length) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-muted text-muted-foreground">
        No photos available
      </div>
    )
  }

  const sorted = [...photos].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <>
      <div className="grid gap-2 rounded-xl overflow-hidden"
        style={{
          gridTemplateColumns: sorted.length === 1 ? "1fr" : "2fr 1fr",
          gridTemplateRows: sorted.length <= 2 ? "300px" : "150px 150px",
        }}
      >
        <button
          onClick={() => { setCurrentIndex(0); setLightboxOpen(true) }}
          className="relative overflow-hidden bg-muted"
          style={{ gridRow: sorted.length > 2 ? "1 / 3" : "1" }}
        >
          <img src={sorted[0].url} alt={sorted[0].caption || ""} className="h-full w-full object-cover hover:scale-105 transition-transform" />
        </button>
        {sorted.slice(1, 3).map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => { setCurrentIndex(i + 1); setLightboxOpen(true) }}
            className="relative overflow-hidden bg-muted"
          >
            <img src={photo.url} alt={photo.caption || ""} className="h-full w-full object-cover hover:scale-105 transition-transform" />
            {i === 1 && sorted.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold">
                +{sorted.length - 3} more
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={() => setLightboxOpen(false)}>
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + sorted.length) % sorted.length) }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={sorted[currentIndex].url}
            alt={sorted[currentIndex].caption || ""}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % sorted.length) }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-4 text-white text-sm">
            {currentIndex + 1} / {sorted.length}
          </div>
        </div>
      )}
    </>
  )
}