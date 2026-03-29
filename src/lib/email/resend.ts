import { Resend } from "resend";
import type { EmailProvider, EmailOptions, EmailResult } from "./types";

export class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY);
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo ? [options.replyTo] : undefined,
      });

      if (error) {
        return {
          success: false,
          provider: "resend",
          error: error.message,
        };
      }

      return {
        success: true,
        provider: "resend",
        messageId: data?.id,
      };
    } catch (err) {
      return {
        success: false,
        provider: "resend",
        error: err instanceof Error ? err.message : "Resend send failed",
      };
    }
  }
}
