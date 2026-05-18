"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { respondToBooking, cancelBooking } from "@/actions/bookings"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function BookingActions({
  bookingId,
  canCancel,
}: {
  bookingId: string
  canCancel?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [confirmCancel, setConfirmCancel] = useState(false)

  async function handleApprove() {
    setLoading(true)
    setError("")
    const result = await respondToBooking(bookingId, "approve", note || undefined)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  async function handleDecline() {
    setLoading(true)
    setError("")
    const result = await respondToBooking(bookingId, "decline", note || undefined)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  async function handleCancel() {
    setLoading(true)
    setError("")
    const result = await cancelBooking(bookingId)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  if (canCancel) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        {!confirmCancel ? (
          <button
            onClick={() => setConfirmCancel(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Cancel Booking
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                disabled={loading}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                No, Keep It
              </button>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Respond to Request</h2>
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-muted-foreground">
          Add a note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any message for the guest..."
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white hover:bg-success/90 disabled:opacity-50 transition-colors"
        >
          <CheckCircle className="h-4 w-4" />
          {loading ? "Processing..." : "Approve"}
        </button>
        <button
          onClick={handleDecline}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
        >
          <XCircle className="h-4 w-4" />
          {loading ? "Processing..." : "Decline"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  )
}