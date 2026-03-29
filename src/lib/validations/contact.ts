import { z } from "zod";

export const contactFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    message: z.string().min(1, "Message is required"),
    honeypot: z.string().max(0).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Please provide either an email or phone number",
  });

export const whatsappLeadSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  source: z.string().optional().or(z.literal("")),
});
