import { Resend } from "resend";
let __resendInstance: ReturnType<typeof getResend> | null = null
function getResend() {
  if (!__resendInstance) {
    __resendInstance = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  }
  return __resendInstance
}
const resend = new Proxy({} as ReturnType<typeof getResend>, {
  get(_, prop) {
    const target = getResend() as Record<string | symbol, unknown>
    const value = target[prop]
    return typeof value === "function" ? value.bind(target) : value
  },
})
interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}
export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  if (!resend) {
    console.log("Email not sent (no API key):", { to, subject, text });
    return;
  }
  try {
    await resend.emails.send({
      from: "Musa Residency <noreply@musaresidency.com>",
      to,
      subject,
      text,
      html: html || text,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}