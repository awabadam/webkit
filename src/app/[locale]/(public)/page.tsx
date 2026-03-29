import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { ServiceCard } from "@/components/public/service-card";
import { buttonVariants } from "@/components/ui/button-variants";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { localBusinessSchema } from "@/lib/seo/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return generatePageMetadata("home", locale, settings);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [settings, services] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      <JsonLd data={localBusinessSchema(settings)} />
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {settings?.businessName || "Welcome"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {settings?.metaDescription || "Your trusted local business"}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href={`/${locale}/contact`} className={buttonVariants({ size: "lg" })}>
            Get in Touch
          </Link>
          <Link href={`/${locale}/services`} className={buttonVariants({ variant: "outline", size: "lg" })}>
            Our Services
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      {services.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} locale={locale} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={`/${locale}/services`} className={buttonVariants({ variant: "outline" })}>
              View All Services
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
