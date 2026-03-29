"use server";

import { prisma } from "@/lib/db/client";
import { contactFormSchema, whatsappLeadSchema } from "@/lib/validations/contact";
import { sendEmail } from "@/lib/email";
import { contactNotificationEmail } from "@/lib/email/templates";

export type ContactState = {
  error?: string;
  success?: boolean;
};

export type WhatsAppState = {
  error?: string;
  redirectUrl?: string;
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());

  // Honeypot check
  if (raw.honeypot) {
    return { success: true }; // Silently accept but don't save
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  const submission = await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      message: data.message,
    },
  });

  // Fire-and-forget email notification
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const adminEmail = settings?.email || process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const template = contactNotificationEmail(submission, settings);
    sendEmail({ to: adminEmail, ...template }).catch((err) =>
      console.error("[email] Failed to send contact notification:", err)
    );
  }

  return { success: true };
}

export async function submitWhatsAppLead(
  _prevState: WhatsAppState,
  formData: FormData
): Promise<WhatsAppState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = whatsappLeadSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  await prisma.whatsAppLead.create({
    data: {
      name: data.name || null,
      phone: data.phone,
      source: data.source || null,
    },
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const whatsappNumber = settings?.whatsappNumber || process.env.WHATSAPP_NUMBER || "";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const redirectUrl = `https://wa.me/${cleanNumber}`;

  return { redirectUrl };
}
