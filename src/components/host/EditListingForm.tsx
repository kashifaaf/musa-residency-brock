"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema } from "@/types";
import { updateListing } from "@/actions/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PROPERTY_TYPES, GENERAL_AMENITIES, CREATIVE_AMENITIES } from "@/lib/constants";
import { PhotoUpload } from "./PhotoUpload";
import toast from "react-hot-toast";
import type { z } from "zod";
import type { Listing, ListingPhoto } from "@/types";

type ListingData = z.infer<typeof listingSchema>;

interface EditListingFormProps {
  listing: Listing;
  photos: ListingPhoto[];
}

export function EditListingForm({ listing, photos }: EditListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ListingData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      country: listing.country,
      propertyType: listing.propertyType,
      maxGuests: listing.maxGuests,
      bedrooms: listing.bedrooms,
      bathrooms: Number(listing.bathrooms),
      amenities: listing.amenities as string[],
      creativeAmenities: listing.creativeAmenities as string[],
      houseRules: listing.houseRules || "",
      neighborhoodDescription: listing.neighborhoodDescription || "",
      pricePerNight: Number(listing.pricePerNight),
      minimumStay: listing.minimumStay,
    },
  });

  const selectedAmenities = watch("amenities");
  const selectedCreativeAmenities = watch("creativeAmenities");

  const onSubmit = async (data: ListingData) => {
    try {
      setIsLoading(true);
      const result = await updateListing(listing.id, data);
      
      if (result.success) {
        toast.success("Listing updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to update listing");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Photos</h2>
        <PhotoUpload listingId={listing.id} existingPhotos={photos} />
      </Card>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Cozy artist studio in Brooklyn"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your space, what makes it special for creative work..."
                rows={6}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Location</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Brooklyn"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="United States"
                />
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                onValueChange={(value) => setValue("propertyType", value)}
                defaultValue={watch("propertyType")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-sm text-destructive">{errors.propertyType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max Guests</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  {...register("maxGuests", { valueAsNumber: true })}
                  min={1}
                  max={10}
                />
                {errors.maxGuests && (
                  <p className="text-sm text-destructive">{errors.maxGuests.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...register("bedrooms", { valueAsNumber: true })}
                  min={0}
                  max={10}
                />
                {errors.bedrooms && (
                  <p className="text-sm text-destructive">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  {...register("bathrooms", { valueAsNumber: true })}
                  min={0.5}
                  max={10}
                />
                {errors.bathrooms && (
                  <p className="text-sm text-destructive">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Amenities</h3>
            
            <div className="space-y-4">
              <Label>General Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GENERAL_AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue("amenities", [...selectedAmenities, amenity]);
                        } else {
                          setValue("amenities", selectedAmenities.filter(a => a !== amenity));
                        }
                      }}
                    />
                    <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Creative Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CREATIVE_AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`creative-${amenity}`}
                      checked={selectedCreativeAmenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue("creativeAmenities", [...selectedCreativeAmenities, amenity]);
                        } else {
                          setValue("creativeAmenities", selectedCreativeAmenities.filter(a => a !== amenity));
                        }
                      }}
                    />
                    <Label htmlFor={`creative-${amenity}`} className="text-sm font-normal cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="neighborhoodDescription">Neighborhood Description</Label>
              <Textarea
                id="neighborhoodDescription"
                {...register("neighborhoodDescription")}
                placeholder="Tell guests about the neighborhood, local art scene, cafes..."
                rows={4}
              />
              {errors.neighborhoodDescription && (
                <p className="text-sm text-destructive">{errors.neighborhoodDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseRules">House Rules</Label>
              <Textarea
                id="houseRules"
                {...register("houseRules")}
                placeholder="Any specific rules or guidelines for guests..."
                rows={4}
              />
              {errors.houseRules && (
                <p className="text-sm text-destructive">{errors.houseRules.message}</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Pricing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price per Night (USD) *</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  step="0.01"
                  {...register("pricePerNight", { valueAsNumber: true })}
                  min={0}
                />
                {errors.pricePerNight && (
                  <p className="text-sm text-destructive">{errors.pricePerNight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumStay">Minimum Stay (nights)</Label>
                <Input
                  id="minimumStay"
                  type="number"
                  {...register("minimumStay", { valueAsNumber: true })}
                  min={1}
                  max={365}
                />
                {errors.minimumStay && (
                  <p className="text-sm text-destructive">{errors.minimumStay.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}