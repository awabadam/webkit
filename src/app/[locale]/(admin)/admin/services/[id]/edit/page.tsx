import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { ServiceForm } from "@/components/admin/service-form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
      <ServiceForm service={service} />
    </div>
  );
}
