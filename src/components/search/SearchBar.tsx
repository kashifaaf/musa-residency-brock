"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    if (guests !== "1") params.set("guests", guests);

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow-sm border">
      <div className="flex-1">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            {checkIn ? format(checkIn, "MMM d") : "Check in"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={checkIn}
            onSelect={setCheckIn}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            {checkOut ? format(checkOut, "MMM d") : "Check out"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={checkOut}
            onSelect={setCheckOut}
            disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
          />
        </PopoverContent>
      </Popover>

      <Select value={guests} onValueChange={setGuests}>
        <SelectTrigger className="w-[120px]">
          <Users className="mr-2 h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? "Guest" : "Guests"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}