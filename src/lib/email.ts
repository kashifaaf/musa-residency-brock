interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // In a real implementation, you would use a service like SendGrid, Resend, or AWS SES
  // For now, we'll just log the email
  console.log('Email would be sent:', {
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export function generateBookingRequestEmail(hostName: string, guestName: string, homeName: string): string {
  return `
    <h2>New Booking Request</h2>
    <p>Hi ${hostName},</p>
    <p>You have a new booking request from ${guestName} for your property "${homeName}".</p>
    <p>Please log in to your Musa Residency account to review and respond within 24 hours.</p>
    <p>Best regards,<br>The Musa Residency Team</p>
  `;
}

export function generateBookingApprovedEmail(guestName: string, homeName: string): string {
  return `
    <h2>Booking Approved!</h2>
    <p>Hi ${guestName},</p>
    <p>Great news! Your booking request for "${homeName}" has been approved.</p>
    <p>Please complete your payment to confirm your reservation.</p>
    <p>Best regards,<br>The Musa Residency Team</p>
  `;
}

export function generateBookingDeclinedEmail(guestName: string, homeName: string): string {
  return `
    <h2>Booking Request Update</h2>
    <p>Hi ${guestName},</p>
    <p>Unfortunately, your booking request for "${homeName}" was not approved.</p>
    <p>Don't worry - there are many other amazing properties available on Musa Residency!</p>
    <p>Best regards,<br>The Musa Residency Team</p>
  `;
}