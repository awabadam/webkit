import Image from "next/image";
import Link from "next/link";
import type { Service } from "@prisma/client";

export function ServiceCard({
  service,
  locale,
}: {
  service: Service;
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/services/${service.slug}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      {service.imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{service.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
      </div>
    </Link>
  );
}
