"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadDropzone } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { ListingPhoto } from "@/types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface PhotoUploadProps {
  listingId: string;
  existingPhotos?: ListingPhoto[];
  onComplete?: () => void;
}

export function PhotoUpload({ listingId, existingPhotos = [], onComplete }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<ListingPhoto[]>(existingPhotos);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (res: any[]) => {
    const newPhotos = res.map((file, index) => ({
      id: file.key,
      listingId,
      url: file.url,
      caption: null,
      order: photos.length + index,
      createdAt: new Date(),
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`Uploaded ${res.length} photo${res.length > 1 ? 's' : ''}!`);
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    toast.error(`Upload failed: ${error.message}`);
    setIsUploading(false);
  };

  const removePhoto = async (photoId: string) => {
    // In a real app, you'd call an API to delete the photo
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    toast.success("Photo removed");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <Card key={photo.id} className="relative aspect-square overflow-hidden">
            <Image
              src={photo.url}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <Button
              onClick={() => removePhoto(photo.id)}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      {photos.length < 20 && (
        <Card className="p-6">
          <UploadDropzone<OurFileRouter, "listingImage">
            endpoint="listingImage"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onUploadBegin={() => setIsUploading(true)}
            config={{
              mode: "auto",
            }}
            content={{
              uploadIcon: <Upload className="h-10 w-10 text-muted-foreground" />,
              label: "Choose photos or drag and drop",
              allowedContent: "Images up to 10MB (max 20 photos)",
              button: "Upload Photos",
            }}
            appearance={{
              container: "border-2 border-dashed border-muted-foreground/25 bg-muted/25",
              uploadIcon: "text-muted-foreground",
              label: "text-foreground font-medium",
              allowedContent: "text-muted-foreground text-sm",
              button: "bg-primary text-primary-foreground hover:bg-primary/90",
            }}
          />
        </Card>
      )}

      {photos.length === 0 && (
        <div className="text-center py-8">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Add photos to your listing</h3>
          <p className="text-muted-foreground">
            Upload high-quality photos that showcase your space. You can add up to 20 photos.
          </p>
        </div>
      )}

      {onComplete && photos.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onComplete} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}