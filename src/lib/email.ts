import { Resend } from "resend"

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }
    _resend = new Resend(apiKey)
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
  const fromEmail = process.env.EMAIL_FROM || "noreply@musaresidency.com"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  try {
    await getResend().emails.send({
      from: `Musa Residency <${fromEmail}>`,
      to: hostEmail,
      subject: `New booking request from ${guestName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7e22ce;">New Booking Request</h2>
          <p>Hi ${hostName},</p>
          <p><strong>${guestName}</strong> has requested to book your listing <strong>${listingTitle}</strong>.</p>
          <p><strong>Check-in:</strong> ${checkIn}<br/><strong>Check-out:</strong> ${checkOut}</p>
          <p style="color: #ea580c; font-weight: bold;">You have 24 hours to respond before this request auto-declines.</p>
          <a href="${appUrl}/bookings/${bookingId}" style="display: inline-block; background: #7e22ce; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Review Request</a>
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send booking request email:", error)
  }
}

export async function sendBookingStatusEmail(
  guestEmail: string,
  guestName: string,
  listingTitle: string,
  status: string,
  bookingId: string
) {
  const fromEmail = process.env.EMAIL_FROM || "noreply@musaresidency.com"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const statusMessages: Record<string, string> = {
    approved: "Your booking has been approved! Please complete payment to confirm.",
    declined: "Unfortunately, your booking request was declined.",
    expired: "Your booking request has expired because the host did not respond in time.",
    paid: "Your payment has been received. Your booking is confirmed!",
    cancelled: "Your booking has been cancelled.",
  }

  try {
    await getResend().emails.send({
      from: `Musa Residency <${fromEmail}>`,
      to: guestEmail,
      subject: `Booking ${status}: ${listingTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7e22ce;">Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
          <p>Hi ${guestName},</p>
          <p>${statusMessages[status] || `Your booking status has been updated to: ${status}`}</p>
          <p>Listing: <strong>${listingTitle}</strong></p>
          <a href="${appUrl}/bookings/${bookingId}" style="display: inline-block; background: #7e22ce; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View Booking</a>
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send booking status email:", error)
  }
}