import type { ContactSubmission, WhatsAppLead, SiteSettings } from "@prisma/client";
import type { EmailOptions } from "./types";

export function contactNotificationEmail(
  submission: ContactSubmission,
  settings: SiteSettings | null
): Omit<EmailOptions, "to"> {
  const siteName = settings?.businessName || "Your Website";

  return {
    subject: `New contact from ${submission.name} — ${siteName}`,
    replyTo: submission.email || undefined,
    html: `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${submission.name}</td></tr>
        ${submission.email ? `<tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${submission.email}</td></tr>` : ""}
        ${submission.phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${submission.phone}</td></tr>` : ""}
        <tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${submission.message}</td></tr>
      </table>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Sent from ${siteName}</p>
    `,
    text: `New contact from ${submission.name}\n\nEmail: ${submission.email || "N/A"}\nPhone: ${submission.phone || "N/A"}\nMessage: ${submission.message}`,
  };
}

export function whatsappLeadEmail(
  lead: WhatsAppLead,
  settings: SiteSettings | null
): Omit<EmailOptions, "to"> {
  const siteName = settings?.businessName || "Your Website";

  return {
    subject: `New WhatsApp lead — ${siteName}`,
    html: `
      <h2>New WhatsApp Lead</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        ${lead.name ? `<tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${lead.name}</td></tr>` : ""}
        <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${lead.phone}</td></tr>
        ${lead.source ? `<tr><td style="padding: 8px; font-weight: bold;">Source</td><td style="padding: 8px;">${lead.source}</td></tr>` : ""}
      </table>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Sent from ${siteName}</p>
    `,
    text: `New WhatsApp lead\n\nName: ${lead.name || "N/A"}\nPhone: ${lead.phone}\nSource: ${lead.source || "N/A"}`,
  };
}
