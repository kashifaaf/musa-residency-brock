"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { approveBooking, declineBooking } from "@/app/actions/bookings"

interface BookingActionsProps {
  bookingId: string
}

export function BookingActions({ bookingId }: BookingActionsProps) {
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [declineMessage, setDeclineMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleApprove() {
    setIsSubmitting(true)
    try {
      const result = await approveBooking(bookingId)
      if (!result.success) {
        alert(result.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDecline() {
    setIsSubmitting(true)
    try {
      const result = await declineBooking(bookingId, declineMessage)
      if (result.success) {
        setShowDeclineForm(false)
      } else {
        alert(result.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showDeclineForm) {
    return (
      <div className="space-y-2">
        <Textarea
          placeholder="Reason for declining (optional)..."
          value={declineMessage}
          onChange={(e) => setDeclineMessage(e.target.value)}
          rows={2}
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDeclineForm(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDecline}
            disabled={isSubmitting}
          >
            {isSubmitting ? "..." : "Decline"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button 
        size="sm"
        onClick={handleApprove}
        disabled={isSubmitting}
      >
        {isSubmitting ? "..." : "Approve"}
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowDeclineForm(true)}
      >
        Decline
      </Button>
    </div>
  )
}