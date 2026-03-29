import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { ServicesList } from "@/components/admin/services-list";
import { buttonVariants } from "@/components/ui/button-variants";
import { Plus } from "lucide-react";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link href={`/${locale}/admin/services/new`} className={buttonVariants()}>
          <Plus className="h-4 w-4 me-2" />
          Add Service
        </Link>
      </div>
      <ServicesList services={services} />
    </div>
  );
}
