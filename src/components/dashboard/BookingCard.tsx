import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, isWithin24Hours } from "@/lib/utils";

interface BookingCardProps {
  booking: any;
  viewAs: "guest" | "host";
}

export function BookingCard({ booking, viewAs }: BookingCardProps) {
  const getStatusBadge = () => {
    switch (booking.status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
    }
  };

  const needsResponse = viewAs === "host" && booking.status === "pending" && isWithin24Hours(booking.createdAt);

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={booking.listing.photos[0]?.url || "/placeholder.jpg"}
            alt={booking.listing.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold truncate">{booking.listing.title}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {booking.listing.city}, {booking.listing.country}
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {viewAs === "guest" ? booking.host.name : booking.guest.name}
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">{formatCurrency(Number(booking.totalPrice))}</span>
            <Button asChild variant={needsResponse ? "default" : "outline"} size="sm">
              <Link href={`/dashboard/bookings/${booking.id}`}>
                {needsResponse ? "Respond Now" : "View Details"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}