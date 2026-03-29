import { z } from "zod";

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessNameAr: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  whatsappNumber: z.string().optional().default(""),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional().default(""),
  addressAr: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
  socialFacebook: z.string().optional().default(""),
  socialInstagram: z.string().optional().default(""),
  socialTwitter: z.string().optional().default(""),
  socialLinkedin: z.string().optional().default(""),
  metaTitle: z.string().optional().default(""),
  metaTitleAr: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  metaDescriptionAr: z.string().optional().default(""),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
