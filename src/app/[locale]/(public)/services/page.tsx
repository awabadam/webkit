import type { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { ServiceCard } from "@/components/public/service-card";
import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return generatePageMetadata("services", locale, settings);
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      {services.length === 0 ? (
        <p className="text-muted-foreground">No services available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
