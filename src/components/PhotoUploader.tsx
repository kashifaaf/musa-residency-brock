"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Upload, X, GripVertical } from "lucide-react"
import { useUploadThing } from "@/components/UploadThingProvider"
import toast from "react-hot-toast"

type Photo = {
  id?: string
  url: string
  caption?: string
  sortOrder: number
}

export function PhotoUploader({
  photos,
  onChange,
}: {
  photos: Photo[]
  onChange: (photos: Photo[]) => void
}) {
  const [uploading, setUploading] = useState(false)

  const { startUpload } = useUploadThing("listingPhoto", {
    onClientUploadComplete: (res) => {
      if (res) {
        const newPhotos: Photo[] = res.map((file, idx) => ({
          url: file.url,
          sortOrder: photos.length + idx,
        }))
        onChange([...photos, ...newPhotos])
        toast.success(`${res.length} photo${res.length > 1 ? "s" : ""} uploaded`)
      }
      setUploading(false)
    },
    onUploadError: (error) => {
      toast.error(error.message || "Upload failed")
      setUploading(false)
    },
  })

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return
      setUploading(true)
      await startUpload(Array.from(files))
    },
    [startUpload]
  )

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index).map((p, i) => ({ ...p, sortOrder: i }))
    onChange(updated)
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, idx) => (
          <div
            key={`${photo.url}-${idx}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
          >
            <Image
              src={photo.url}
              alt={photo.caption || `Photo ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1 opacity-0 shadow group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4 text-white drop-shadow" />
            </div>
            {idx === 0 && (
              <span className="absolute left-2 top-2 rounded bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
                Cover
              </span>
            )}
          </div>
        ))}

        <label
          className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
              <span className="text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span className="text-xs font-medium">Add Photos</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}