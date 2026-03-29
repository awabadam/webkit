import type { SiteSettings, Service } from "@prisma/client";

export function localBusinessSchema(settings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings?.businessName || "Business",
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.email && { email: settings.email }),
    ...(settings?.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
      },
    }),
    ...(settings?.metaDescription && { description: settings.metaDescription }),
    url: process.env.SITE_URL || "",
    sameAs: [
      settings?.socialFacebook,
      settings?.socialInstagram,
      settings?.socialTwitter,
      settings?.socialLinkedin,
    ].filter(Boolean),
  };
}

export function serviceSchema(
  service: Service,
  settings: SiteSettings | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: settings?.businessName || "Business",
    },
    ...(service.imageUrl && { image: service.imageUrl }),
  };
}
