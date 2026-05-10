"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHome } from "@/actions/homes";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { HomeType, BASIC_AMENITIES, CREATIVE_AMENITIES } from "@/lib/constants";

interface CreateHomeFormProps {
  userId: string;
}

export function CreateHomeForm({ userId }: CreateHomeFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Add selected amenities
    const selectedAmenities = Array.from(
      e.currentTarget.querySelectorAll('input[name="amenities"]:checked')
    ).map((input) => (input as HTMLInputElement).value);
    
    const selectedCreativeAmenities = Array.from(
      e.currentTarget.querySelectorAll('input[name="creativeAmenities"]:checked')
    ).map((input) => (input as HTMLInputElement).value);

    // Remove individual checkboxes and add arrays
    formData.delete("amenities");
    formData.delete("creativeAmenities");
    selectedAmenities.forEach(a => formData.append("amenities", a));
    selectedCreativeAmenities.forEach(a => formData.append("creativeAmenities", a));

    const result = await createHome(formData);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/homes/${result.data.id}`);
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <input type="hidden" name="userId" value={userId} />

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div>
          <Label htmlFor="title">Listing Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1"
            placeholder="Cozy Artist Loft in Brooklyn"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            className="mt-1"
            rows={5}
            placeholder="Describe your space and what makes it special..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="homeType">Home Type</Label>
            <Select id="homeType" name="homeType" required className="mt-1">
              <option value="">Select type...</option>
              {Object.entries(HomeType).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="maxGuests">Maximum Guests</Label>
            <Input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min="1"
              max="20"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              max="20"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min="1"
              max="20"
              step="0.5"
              required
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Location</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              className="mt-1"
              placeholder="Brooklyn"
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              type="text"
              required
              className="mt-1"
              placeholder="United States"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Street Address (optional)</Label>
          <Input
            id="address"
            name="address"
            type="text"
            className="mt-1"
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <Label htmlFor="location">Full Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            required
            className="mt-1"
            placeholder="Brooklyn, New York, United States"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Amenities</h2>
        
        <div>
          <Label>Basic Amenities</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BASIC_AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{amenity.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Creative Amenities</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CREATIVE_AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="creativeAmenities"
                  value={amenity}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{amenity.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* House Rules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">House Rules (optional)</h2>
        <Textarea
          name="houseRules"
          rows={4}
          placeholder="Any specific rules or guidelines for guests..."
        />
      </div>

      {/* Local Art Scene */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Local Art Scene (optional)</h2>
        <Textarea
          name="localArtScene"
          rows={4}
          placeholder="Tell guests about galleries, studios, or creative spaces nearby..."
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}