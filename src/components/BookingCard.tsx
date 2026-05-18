"use client"

import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { BookingWithDetails } from "@/types"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning", icon: Clock },
  approved: { label: "Approved", color: "bg-success/10 text-success", icon: CheckCircle },
  declined: { label: "Declined", color: "bg-destructive/10 text-destructive", icon: XCircle },
  expired: { label: "Expired", color: "bg-muted text-muted-foreground", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground", icon: XCircle },
  completed: { label: "Completed", color: "bg-success/10 text-success", icon: CheckCircle },
}

export function BookingCard({ booking, role }: { booking: BookingWithDetails; role: "host" | "guest" }) {
  const config = statusConfig[booking.status]
  const StatusIcon = config.icon
  const coverPhoto = booking.listing?.photos?.[0]?.url
  const otherParty = role === "host" ? booking.guest : booking.host

  return (
    <Link
      href={ROUTES.booking(booking.id)}
      className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full sm:h-auto sm:w-48 flex-shrink-0 bg-muted">
          {coverPhoto ? (
            <img src={coverPhoto} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No Photo</div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-card-foreground line-clamp-1">
                {booking.listing?.title || "Listing"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
              </p>
            </div>
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.color)}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {otherParty?.image ? (
              <img src={otherParty.image} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                {otherParty?.name?.charAt(0) || "?"}
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {role === "host" ? "Guest" : "Host"}: {otherParty?.name || "Unknown"}
            </span>
          </div>
          <div className="mt-2 text-sm font-medium text-foreground">
            Total: {formatCurrency(booking.totalPrice * 100)}
          </div>
        </div>
      </div>
    </Link>
  )
}