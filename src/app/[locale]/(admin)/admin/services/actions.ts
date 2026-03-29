"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { createServiceSchema, updateServiceSchema } from "@/lib/validations/service";
import { slugify } from "@/lib/utils/slugify";

export type ServiceState = {
  error?: string;
  success?: boolean;
};

export async function createService(
  _prevState: ServiceState,
  formData: FormData
): Promise<ServiceState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = createServiceSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);

  const existing = await prisma.service.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A service with this slug already exists" };
  }

  const maxOrder = await prisma.service.aggregate({ _max: { sortOrder: true } });

  await prisma.service.create({
    data: {
      title: data.title,
      titleAr: data.titleAr,
      description: data.description,
      descriptionAr: data.descriptionAr,
      slug,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  redirect("/en/admin/services");
}

export async function updateService(
  _prevState: ServiceState,
  formData: FormData
): Promise<ServiceState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateServiceSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);

  const existing = await prisma.service.findUnique({ where: { slug } });
  if (existing && existing.id !== data.id) {
    return { error: "A service with this slug already exists" };
  }

  await prisma.service.update({
    where: { id: data.id },
    data: {
      title: data.title,
      titleAr: data.titleAr,
      description: data.description,
      descriptionAr: data.descriptionAr,
      slug,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished,
    },
  });

  redirect("/en/admin/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}

export async function togglePublish(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return;

  await prisma.service.update({
    where: { id },
    data: { isPublished: !service.isPublished },
  });

  revalidatePath("/admin/services");
}

export async function reorderServices(items: { id: string; sortOrder: number }[]) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.service.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  revalidatePath("/admin/services");
}
