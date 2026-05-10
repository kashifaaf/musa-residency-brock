"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type Home } from "@/types";

interface HomeGalleryProps {
  home: Home;
}

export function HomeGallery({ home }: HomeGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const photos = home.photos || [];

  const showPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const showNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-lg bg-gray-200">
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-2 overflow-hidden rounded-lg md:grid-cols-4 md:grid-rows-2">
        {photos.slice(0, 5).map((photo, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative ${
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            } ${index >= 5 ? "hidden md:block" : ""} overflow-hidden hover:opacity-90`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                fill
                className="object-cover"
                sizes={index === 0 ? "50vw" : "25vw"}
              />
            </div>
          </button>
        ))}
        
        {photos.length > 5 && (
          <button
            onClick={() => setSelectedIndex(5)}
            className="relative hidden md:block"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={photos[5].url}
                alt={photos[5].caption || "Photo 6"}
                fill
                className="object-cover"
                sizes="25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-lg font-semibold text-white">
                  +{photos.length - 5} more
                </span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={showPrevious}
            disabled={selectedIndex === 0}
            className="absolute left-4 text-white hover:text-gray-300 disabled:opacity-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={showNext}
            disabled={selectedIndex === photos.length - 1}
            className="absolute right-4 text-white hover:text-gray-300 disabled:opacity-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={photos[selectedIndex].url}
              alt={photos[selectedIndex].caption || `Photo ${selectedIndex + 1}`}
              width={1200}
              height={800}
              className="h-auto w-auto object-contain"
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}