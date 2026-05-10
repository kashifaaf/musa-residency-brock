"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { HomeType } from "@/lib/constants";

interface SearchFiltersProps {
  initialFilters: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export function SearchFilters({ initialFilters }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.replace(`/search?${params.toString()}`);
  }

  function clearFilters() {
    router.replace("/search");
  }

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      <div>
        <Label htmlFor="filter-location">Location</Label>
        <Input
          id="filter-location"
          type="text"
          placeholder="City or country"
          defaultValue={initialFilters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="filter-checkin">Check-in</Label>
        <Input
          id="filter-checkin"
          type="date"
          defaultValue={initialFilters.checkIn}
          onChange={(e) => handleFilterChange("checkIn", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="filter-checkout">Check-out</Label>
        <Input
          id="filter-checkout"
          type="date"
          defaultValue={initialFilters.checkOut}
          onChange={(e) => handleFilterChange("checkOut", e.target.value)}
          min={initialFilters.checkIn || new Date().toISOString().split("T")[0]}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="filter-guests">Guests</Label>
        <Input
          id="filter-guests"
          type="number"
          min="1"
          max="10"
          defaultValue={initialFilters.guests}
          onChange={(e) => handleFilterChange("guests", e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="filter-hometype">Home Type</Label>
        <Select
          id="filter-hometype"
          onChange={(e) => handleFilterChange("homeType", e.target.value)}
          className="mt-1"
        >
          <option value="">All types</option>
          {Object.entries(HomeType).map(([key, value]) => (
            <option key={key} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}