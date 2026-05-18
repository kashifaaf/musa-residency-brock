import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, messages } from "@/lib/db/schema"
import { eq, and, or, asc } from "drizzle-orm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BookingActions } from "@/components/BookingActions"
import { MessageThread } from "@/components/MessageThread"
import { formatCurrency, formatDate, isBookingExpired } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import type { MessageWithSender } from "@/types"
import Link from "next/link"

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-warning/10 text-warning border-warning/30", icon: Clock },
  approved: { label: "Approved", color: "bg-success/10 text-success border-success/30", icon: CheckCircle },
  declined: { label: "Declined", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
  expired: { label: "Expired", color: "bg-muted text-muted-foreground border-border", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/30", icon: CheckCircle },
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const { id } = await params

  const booking = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.id, id),
      or(eq(bookings.guestId, session.user.id), eq(bookings.hostId, session.user.id))
    ),
    with: {
      listing: { with: { photos: true } },
      guest: {
        columns: { id: true, name: true, image: true, location: true, bio: true, workInfo: true, socialLinks: true },
      },
      host: {
        columns: { id: true, name: true, image: true },
      },
      payment: true,
    },
  })

  if (!booking) {
    notFound()
  }

  const bookingMessages = (await db.query.messages.findMany({
    where: eq(messages.bookingId, id),
    with: {
      sender: {
        columns: { id: true, name: true, image: true },
      },
    },
    orderBy: [asc(messages.createdAt)],
  })) as MessageWithSender[]

  const isHost = booking.hostId === session.user.id
  const isGuest = booking.guestId === session.user.id
  const config = statusConfig[booking.status]
  const StatusIcon = config.icon
  const coverPhoto = booking.listing?.photos?.[0]?.url
  const expired = booking.status === "pending" && isBookingExpired(booking.respondBy)
  const socialLinks = booking.guest.socialLinks as Record<string, string> | null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <Link href="/bookings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to bookings
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Banner */}
              <div className={cn("flex items-center gap-3 rounded-xl border p-4", config.color)}>
                <StatusIcon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{config.label}</p>
                  {booking.status === "pending" && !expired && (
                    <p className="text-sm opacity-80">
                      Host must respond by {formatDate(booking.respondBy, { hour: "numeric", minute: "2-digit" })}
                    </p>
                  )}
                  {expired && booking.status === "pending" && (
                    <p className="text-sm opacity-80">Response deadline has passed</p>
                  )}
                </div>
              </div>

              {/* Listing Info */}
              <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
                {coverPhoto && (
                  <img src={coverPhoto} alt="" className="h-24 w-24 rounded-lg object-cover flex-shrink-0" />
                )}
                <div>
                  <Link href={`/listings/${booking.listingId}`} className="font-semibold text-foreground hover:text-accent transition-colors">
                    {booking.listing?.title || "Listing"} <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {booking.listing?.location}
                  </p>
                  <div className="mt-2 text-sm text-foreground">
                    <span className="font-medium">{formatDate(booking.checkIn)}</span>
                    {" → "}
                    <span className="font-medium">{formatDate(booking.checkOut)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Total: {formatCurrency(booking.totalPrice * 100)}
                  </p>
                </div>
              </div>

              {/* Guest Profile (visible to host) */}
              {isHost && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Guest Profile</h2>
                  <div className="mt-4 flex items-start gap-4">
                    {booking.guest.image ? (
                      <img src={booking.guest.image} alt="" className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-medium">
                        {booking.guest.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{booking.guest.name}</h3>
                      {booking.guest.location && (
                        <p className="text-sm text-muted-foreground">{booking.guest.location}</p>
                      )}
                      {booking.guest.workInfo && (
                        <p className="mt-1 text-sm text-foreground">{booking.guest.workInfo}</p>
                      )}
                      {booking.guest.bio && (
                        <p className="mt-2 text-sm text-foreground">{booking.guest.bio}</p>
                      )}
                      {socialLinks && Object.keys(socialLinks).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(socialLinks)
                            .filter(([, v]) => v)
                            .map(([key, value]) => (
                              <a
                                key={key}
                                href={value.startsWith("http") ? value : `https://${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:border-accent/50 transition-colors"
                              >
                                {key}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Guest Message */}
              {booking.guestMessage && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Guest&apos;s Message</h2>
                  <p className="mt-3 whitespace-pre-line text-sm text-foreground">{booking.guestMessage}</p>
                </div>
              )}

              {/* Host Response */}
              {booking.hostResponseNote && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Host&apos;s Response</h2>
                  <p className="mt-3 whitespace-pre-line text-sm text-foreground">{booking.hostResponseNote}</p>
                </div>
              )}

              {/* Host Actions */}
              {isHost && booking.status === "pending" && !expired && (
                <BookingActions bookingId={booking.id} />
              )}

              {/* Cancel (for guest, or host on approved) */}
              {((isGuest && booking.status === "pending") || (booking.status === "approved")) && (
                <BookingActions bookingId={booking.id} canCancel />
              )}

              {/* Messages */}
              {(booking.status === "approved" || booking.status === "completed") && (
                <MessageThread messages={bookingMessages} bookingId={booking.id} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Payment Info */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-semibold text-foreground">Payment</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize text-foreground">
                        {booking.payment?.status || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(booking.totalPrice * 100)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-semibold text-foreground">Timeline</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested</span>
                      <span className="text-foreground">{formatDate(booking.createdAt)}</span>
                    </div>
                    {booking.respondedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Responded</span>
                        <span className="text-foreground">{formatDate(booking.respondedAt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="text-foreground">{formatDate(booking.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="text-foreground">{formatDate(booking.checkOut)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}