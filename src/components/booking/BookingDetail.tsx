"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MapPin, Users, MessageCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, isWithin24Hours, getResponseDeadline } from "@/lib/utils";
import { approveBooking, declineBooking, cancelBooking } from "@/actions/booking";
import toast from "react-hot-toast";
import type { BookingWithRelations } from "@/types";

interface BookingDetailProps {
  booking: BookingWithRelations;
  isHost: boolean;
}

export function BookingDetail({ booking, isHost }: BookingDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [hostMessage, setHostMessage] = useState("");

  const handleApprove = async () => {
    try {
      setIsLoading("approve");
      const result = await approveBooking(booking.id, hostMessage);
      
      if (result.success) {
        toast.success("Booking approved!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to approve booking");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDecline = async () => {
    if (!hostMessage.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }

    try {
      setIsLoading("decline");
      const result = await declineBooking(booking.id, hostMessage);
      
      if (result.success) {
        toast.success("Booking declined");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to decline booking");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoading("cancel");
      const result = await cancelBooking(booking.id);
      
      if (result.success) {
        toast.success("Booking cancelled");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

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

  const showHostActions = isHost && booking.status === "pending" && isWithin24Hours(booking.createdAt);
  const showGuestCancel = !isHost && booking.status === "pending";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        {getStatusBadge()}
      </div>

      {/* Listing Info */}
      <Card className="p-6">
        <div className="flex gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={booking.listing.photos[0]?.url || "/placeholder.jpg"}
              alt={booking.listing.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{booking.listing.title}</h2>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {booking.listing.city}, {booking.listing.country}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(booking.checkIn), "MMM d")} - {format(new Date(booking.checkOut), "MMM d, yyyy")}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {booking.guestCount} {booking.guestCount === 1 ? "guest" : "guests"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Guest/Host Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">{isHost ? "Guest Information" : "Host Information"}</h3>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={isHost ? booking.guest.image || undefined : booking.host.image || undefined} />
            <AvatarFallback>
              {isHost ? booking.guest.name?.[0] || "G" : booking.host.name?.[0] || "H"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">
              {isHost ? booking.guest.name : booking.host.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {isHost ? booking.guest.location : booking.host.location}
            </p>
            {(isHost ? booking.guest.bio : booking.host.bio) && (
              <p className="mt-2 text-sm">
                {isHost ? booking.guest.bio : booking.host.bio}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Messages */}
      {(booking.guestMessage || booking.hostMessage) && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </h3>
          
          {booking.guestMessage && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">From guest:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {booking.guestMessage}
              </p>
            </div>
          )}
          
          {booking.hostMessage && (
            <div>
              <p className="text-sm font-medium mb-1">From host:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {booking.hostMessage}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Pricing */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total amount</span>
            <span className="font-semibold">{formatCurrency(Number(booking.totalPrice))}</span>
          </div>
          {booking.payment && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment status</span>
              <span>{booking.payment.status}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Host Actions */}
      {showHostActions && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Response Required
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please respond by {format(getResponseDeadline(booking.createdAt), "MMM d, h:mm a")}
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="hostMessage" className="text-sm font-medium mb-2 block">
                Message to guest (optional for approval, required for decline)
              </label>
              <Textarea
                id="hostMessage"
                value={hostMessage}
                onChange={(e) => setHostMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={isLoading !== null}
                className="flex-1"
              >
                {isLoading === "approve" ? (
                  "Approving..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Booking
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleDecline}
                variant="destructive"
                disabled={isLoading !== null}
                className="flex-1"
              >
                {isLoading === "decline" ? (
                  "Declining..."
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Guest Cancel Option */}
      {showGuestCancel && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Cancel Booking</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can cancel this booking request before the host responds.
          </p>
          <Button
            onClick={handleCancel}
            variant="destructive"
            disabled={isLoading !== null}
          >
            {isLoading === "cancel" ? "Cancelling..." : "Cancel Booking Request"}
          </Button>
        </Card>
      )}
    </div>
  );
}