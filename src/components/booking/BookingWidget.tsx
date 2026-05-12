"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { createBookingRequest } from "@/actions/booking";
import toast from "react-hot-toast";
import type { ListingWithRelations } from "@/types";

interface BookingWidgetProps {
  listing: ListingWithRelations;
  userId?: string;
}

export function BookingWidget({ listing, userId }: BookingWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guestCount, setGuestCount] = useState("1");
  const [guestMessage, setGuestMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = nights * Number(listing.pricePerNight);

  const isAvailable = (date: Date) => {
    if (!listing.availability) return false;
    
    return listing.availability.some(
      (a) =>
        new Date(a.startDate) <= date &&
        new Date(a.endDate) >= date &&
        !a.isBlocked
    );
  };

  const handleBooking = async () => {
    if (!userId) {
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (nights < listing.minimumStay) {
      toast.error(`Minimum stay is ${listing.minimumStay} nights`);
      return;
    }

    try {
      setIsLoading(true);
      const result = await createBookingRequest({
        listingId: listing.id,
        checkIn,
        checkOut,
        guestCount: parseInt(guestCount),
        guestMessage,
      });

      if (result.success && result.data) {
        toast.success("Booking request sent!");
        router.push(`/dashboard/bookings/${result.data.bookingId}`);
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-4 p-6">
      <div className="text-2xl font-bold mb-4">
        {formatCurrency(Number(listing.pricePerNight))}
        <span className="text-base font-normal text-muted-foreground"> / night</span>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date() || !isAvailable(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => 
                    date < new Date() || 
                    (checkIn && date <= checkIn) ||
                    !isAvailable(date)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label>Guests</Label>
          <Select value={guestCount} onValueChange={setGuestCount}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Message to host</Label>
          <Textarea
            value={guestMessage}
            onChange={(e) => setGuestMessage(e.target.value)}
            placeholder="Introduce yourself and share why you're interested in this space..."
            rows={4}
          />
        </div>

        {nights > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>
                {formatCurrency(Number(listing.pricePerNight))} × {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            {nights < listing.minimumStay && (
              <p className="text-sm text-destructive">
                Minimum stay is {listing.minimumStay} nights
              </p>
            )}
          </div>
        )}

        <Button
          onClick={handleBooking}
          disabled={isLoading || !checkIn || !checkOut || nights < listing.minimumStay}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Sending request..." : "Request to book"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You won't be charged until the host approves your request
        </p>
      </div>
    </Card>
  );
}