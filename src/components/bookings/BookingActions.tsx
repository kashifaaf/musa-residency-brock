"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveBooking, declineBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/Button";
import { BookingRequest } from "@/types";

interface BookingActionsProps {
  booking: BookingRequest;
  isHost: boolean;
}

export function BookingActions({ booking, isHost }: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const result = await approveBooking(booking.id);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  }

  async function handleDecline() {
    if (!confirm("Are you sure you want to decline this booking?")) {
      return;
    }

    setLoading(true);
    const result = await declineBooking(booking.id);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  }

  if (!isHost) {
    return null;
  }

  const isExpired = new Date(booking.requestExpiresAt) < new Date();

  if (isExpired) {
    return (
      <div className="rounded-md bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground">
          This booking request has expired.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleApprove}
        disabled={loading}
        className="flex-1"
      >
        {loading ? "Processing..." : "Approve"}
      </Button>
      <Button
        onClick={handleDecline}
        disabled={loading}
        variant="outline"
        className="flex-1"
      >
        {loading ? "Processing..." : "Decline"}
      </Button>
    </div>
  );
}