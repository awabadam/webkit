"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { siteSettingsSchema } from "@/lib/validations/settings";

export type SettingsState = {
  error?: string;
  success?: boolean;
};

export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      businessName: data.businessName,
      businessNameAr: data.businessNameAr || null,
      phone: data.phone || null,
      whatsappNumber: data.whatsappNumber || null,
      email: data.email || null,
      address: data.address || null,
      addressAr: data.addressAr || null,
      logoUrl: data.logoUrl || null,
      socialFacebook: data.socialFacebook || null,
      socialInstagram: data.socialInstagram || null,
      socialTwitter: data.socialTwitter || null,
      socialLinkedin: data.socialLinkedin || null,
      metaTitle: data.metaTitle || null,
      metaTitleAr: data.metaTitleAr || null,
      metaDescription: data.metaDescription || null,
      metaDescriptionAr: data.metaDescriptionAr || null,
    },
    create: {
      id: "default",
      businessName: data.businessName,
      businessNameAr: data.businessNameAr || null,
      phone: data.phone || null,
      whatsappNumber: data.whatsappNumber || null,
      email: data.email || null,
      address: data.address || null,
      addressAr: data.addressAr || null,
      logoUrl: data.logoUrl || null,
      socialFacebook: data.socialFacebook || null,
      socialInstagram: data.socialInstagram || null,
      socialTwitter: data.socialTwitter || null,
      socialLinkedin: data.socialLinkedin || null,
      metaTitle: data.metaTitle || null,
      metaTitleAr: data.metaTitleAr || null,
      metaDescription: data.metaDescription || null,
      metaDescriptionAr: data.metaDescriptionAr || null,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
