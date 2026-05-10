"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { type Home, type Availability } from "@/types";
import { MIN_STAY_NIGHTS, MAX_STAY_NIGHTS } from "@/lib/constants";
import { calculateNights, formatCurrency } from "@/lib/utils";

interface BookingCardProps {
  home: Home;
  availability: Availability[];
}

export function BookingCard({ home, availability }: BookingCardProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");

  // Calculate price (this is a placeholder - implement actual pricing logic)
  const pricePerNight = 100; // USD
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const subtotal = nights * pricePerNight;
  const serviceFee = Math.round(subtotal * 0.05); // 5% platform fee
  const total = subtotal + serviceFee;

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    setError("");
    
    // Auto-set checkout date to minimum stay
    if (value && !checkOut) {
      const minCheckout = addDays(new Date(value), MIN_STAY_NIGHTS);
      setCheckOut(format(minCheckout, "yyyy-MM-dd"));
    }
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    setError("");
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      return false;
    }

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
    
    if (nights < MIN_STAY_NIGHTS) {
      setError(`Minimum stay is ${MIN_STAY_NIGHTS} nights`);
      return false;
    }
    
    if (nights > MAX_STAY_NIGHTS) {
      setError(`Maximum stay is ${MAX_STAY_NIGHTS} nights`);
      return false;
    }

    // TODO: Check against actual availability
    
    return true;
  };

  const handleBooking = () => {
    if (!validateDates()) return;
    
    const params = new URLSearchParams({
      homeId: home.id,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    
    router.push(`/booking/request?${params.toString()}`);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <div className="mb-1 text-2xl font-bold">
          {formatCurrency(pricePerNight)}
          <span className="text-base font-normal text-gray-600"> / night</span>
        </div>
        <p className="text-sm text-gray-600">
          {MIN_STAY_NIGHTS}-{MAX_STAY_NIGHTS} night stays
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              min={checkIn ? addDays(new Date(checkIn), MIN_STAY_NIGHTS).toISOString().split('T')[0] : ""}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
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
              {Array.from({ length: home.maxGuests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleBooking}
          className="w-full rounded-lg bg-primary-600 py-3 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Request to Book
        </button>

        {nights > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-gray-600">
              <span>{formatCurrency(pricePerNight)} × {nights} nights</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        You won't be charged yet
      </p>
    </div>
  );
}