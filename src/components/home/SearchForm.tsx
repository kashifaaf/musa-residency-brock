"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

export function SearchForm() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests.toString());
    
    router.push(`/homes?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xl sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Where
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or country"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Check in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Check out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || format(new Date(), "yyyy-MM-dd")}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="sm:w-32">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-8 py-3 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}