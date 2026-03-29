import type { Metadata } from "next";
import type { SiteSettings } from "@prisma/client";

export function generatePageMetadata(
  page: string,
  locale: string,
  settings: SiteSettings | null
): Metadata {
  const isAr = locale === "ar";
  const siteName = (isAr ? settings?.businessNameAr : null) || settings?.businessName || "Webkit";
  const defaultDescription =
    (isAr ? settings?.metaDescriptionAr : null) || settings?.metaDescription || "";
  const defaultTitle =
    (isAr ? settings?.metaTitleAr : null) || settings?.metaTitle || siteName;

  const titles: Record<string, string> = {
    home: defaultTitle,
    services: `Services — ${siteName}`,
    gallery: `Gallery — ${siteName}`,
    contact: `Contact — ${siteName}`,
  };

  const title = titles[page] || defaultTitle;
  const siteUrl = process.env.SITE_URL || "";

  return {
    title,
    description: defaultDescription,
    openGraph: {
      title,
      description: defaultDescription,
      siteName,
      locale: isAr ? "ar_SA" : "en_US",
      type: "website",
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: defaultDescription,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },
  };
}
