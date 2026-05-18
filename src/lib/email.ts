import { Resend } from "resend"

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }
    _resend = new Resend(key)
  }
  return _resend
}

export async function sendBookingRequestEmail(
  hostEmail: string,
  hostName: string,
  guestName: string,
  listingTitle: string,
  checkIn: string,
  checkOut: string,
  bookingId: string
) {
  const fromEmail = process.env.EMAIL_FROM || "notifications@musaresidency.com"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  await getResend().emails.send({
    from: fromEmail,
    to: hostEmail,
    subject: `New Booking Request for ${listingTitle}`,
    html: `
      <h2>Hi ${hostName},</h2>
      <p><strong>${guestName}</strong> has requested to stay at your listing <strong>${listingTitle}</strong>.</p>
      <p><strong>Check-in:</strong> ${checkIn}<br/><strong>Check-out:</strong> ${checkOut}</p>
      <p>You have 24 hours to respond. <a href="${appUrl}/bookings/${bookingId}">View Booking Request</a></p>
      <p>— Musa Residency</p>
    `,
  })
}

export async function sendBookingStatusEmail(
  guestEmail: string,
  guestName: string,
  listingTitle: string,
  status: "approved" | "declined" | "expired",
  bookingId: string
) {
  const fromEmail = process.env.EMAIL_FROM || "notifications@musaresidency.com"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const statusMessages = {
    approved: "Your booking has been approved! Payment will now be processed.",
    declined: "Unfortunately, the host has declined your booking request.",
    expired: "Your booking request has expired because the host did not respond in time.",
  }

  await getResend().emails.send({
    from: fromEmail,
    to: guestEmail,
    subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}: ${listingTitle}`,
    html: `
      <h2>Hi ${guestName},</h2>
      <p>${statusMessages[status]}</p>
      <p><strong>Listing:</strong> ${listingTitle}</p>
      <p><a href="${appUrl}/bookings/${bookingId}">View Booking Details</a></p>
      <p>— Musa Residency</p>
    `,
  })
}