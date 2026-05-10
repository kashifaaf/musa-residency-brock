"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Home } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/constants";
import { format } from "date-fns";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 2);
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [minBedrooms, setMinBedrooms] = useState(Number(searchParams.get("minBedrooms")) || 0);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 0) params.set("guests", guests.toString());
    if (propertyType) params.set("propertyType", propertyType);
    if (minBedrooms > 0) params.set("minBedrooms", minBedrooms.toString());
    
    router.push(`/homes?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocation("");
    setCheckIn("");
    setCheckOut("");
    setGuests(2);
    setPropertyType("");
    setMinBedrooms(0);
    router.push("/homes");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-semibold">Filters</h2>
      
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or country"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Check in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Check out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || format(new Date(), "yyyy-MM-dd")}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Property type
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            >
              <option value="">Any type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Minimum bedrooms
          </label>
          <select
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-primary-500 focus:outline-none"
          >
            <option value={0}>Any</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}+
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={applyFilters}
            className="w-full rounded-lg bg-primary-600 py-2 text-white hover:bg-primary-700"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="w-full rounded-lg border border-gray-300 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}