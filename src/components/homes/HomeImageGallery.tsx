"use client";

import { useState } from "react";
import Image from "next/image";
import { HomeImage } from "@/types";

interface HomeImageGalleryProps {
  images: HomeImage[];
  title: string;
}

export function HomeImageGallery({ images, title }: HomeImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-[16/9] relative overflow-hidden bg-black">
        <Image
          src={images[selectedImage].url}
          alt={`${title} - Image ${selectedImage + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === selectedImage
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {images.length > 1 && (
        <>
          <button
            onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}