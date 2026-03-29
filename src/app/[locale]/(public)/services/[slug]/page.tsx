import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db/client";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceSchema } from "@/lib/seo/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return {};

  const siteUrl = process.env.SITE_URL || "";
  return {
    title: service.title,
    description: service.description.slice(0, 160),
    openGraph: {
      title: service.title,
      description: service.description.slice(0, 160),
      ...(service.imageUrl && { images: [{ url: `${siteUrl}${service.imageUrl}` }] }),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  if (!service || !service.isPublished) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <JsonLd data={serviceSchema(service, settings)} />
      {service.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      <div className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
}
