"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBookingRequest } from "@/actions/bookings";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency, getDaysBetween } from "@/lib/utils";
import { Availability } from "@/types";

interface HomeBookingCardProps {
  homeId: string;
  hostId: string;
  availabilities: Availability[];
  minStay: number;
  maxStay: number;
  maxGuests: number;
}

export function HomeBookingCard({
  homeId,
  hostId,
  availabilities,
  minStay,
  maxStay,
  maxGuests,
}: HomeBookingCardProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedAvailability = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    return availabilities.find((avail) => {
      const startDate = new Date(avail.startDate);
      const endDate = new Date(avail.endDate);
      
      return checkInDate >= startDate && checkOutDate <= endDate;
    });
  }, [checkIn, checkOut, availabilities]);

  const nights = checkIn && checkOut ? getDaysBetween(checkIn, checkOut) : 0;
  const pricePerNight = selectedAvailability?.pricePerNight
    ? Number(selectedAvailability.pricePerNight)
    : 100; // Default price
  const totalPrice = nights * pricePerNight;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      setLoading(false);
      return;
    }

    if (nights < minStay) {
      setError(`Minimum stay is ${minStay} nights`);
      setLoading(false);
      return;
    }

    if (maxStay && nights > maxStay) {
      setError(`Maximum stay is ${maxStay} nights`);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("homeId", homeId);
    formData.append("hostId", hostId);
    formData.append("checkIn", checkIn);
    formData.append("checkOut", checkOut);
    formData.append("guests", guests);
    formData.append("totalPrice", totalPrice.toString());
    formData.append("message", message);

    const result = await createBookingRequest(formData);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/bookings/${result.data.id}`);
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-2 text-2xl font-bold">
            {formatCurrency(pricePerNight)}
            <span className="text-base font-normal text-muted-foreground"> / night</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn">Check-in</Label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="checkOut">Check-out</Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max={maxGuests}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message">Message to host (optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1"
            placeholder="Tell the host about yourself and your trip..."
          />
        </div>

        {nights > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>
                {formatCurrency(pricePerNight)} × {nights} nights
              </span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Requesting..." : "Request Booking"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You won't be charged until the host approves
        </p>
      </form>
    </Card>
  );
}