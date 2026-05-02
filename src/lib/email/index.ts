import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendApiKey() {
  return process.env.RESEND_API_KEY;
}

export function getResend() {
  if (!resend) {
    const apiKey = getResendApiKey();
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const resendClient = getResend();
    const result = await resendClient.emails.send({
      from: 'Musa Residency <noreply@musaresidency.com>',
      to,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}