import type { EmailOptions, EmailResult, EmailProvider } from "./types";
import { SmtpProvider } from "./smtp";
import { ResendProvider } from "./resend";

function getProvider(type: string): EmailProvider | null {
  switch (type) {
    case "smtp":
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
      return new SmtpProvider();
    case "resend":
      if (!process.env.RESEND_API_KEY) return null;
      return new ResendProvider();
    default:
      return null;
  }
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const primary = getProvider("smtp");
  const fallback = getProvider("resend");

  if (primary) {
    const result = await primary.send(options);
    if (result.success) return result;
    console.error(`[email] Primary (SMTP) failed: ${result.error}`);
  }

  if (fallback) {
    const result = await fallback.send(options);
    if (result.success) return result;
    console.error(`[email] Fallback (Resend) failed: ${result.error}`);
  }

  if (!primary && !fallback) {
    console.warn("[email] No email providers configured, skipping send");
    return { success: false, error: "No email providers configured" };
  }

  return { success: false, error: "All email providers failed" };
}

export type { EmailOptions, EmailResult } from "./types";
