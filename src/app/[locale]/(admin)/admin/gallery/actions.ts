"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { storage } from "@/lib/storage";

export async function addGalleryImage(url: string) {
  const maxOrder = await prisma.galleryImage.aggregate({
    _max: { sortOrder: true },
  });

  await prisma.galleryImage.create({
    data: {
      url,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return;

  // Extract key from URL (e.g., /api/uploads/abc123-file.jpg -> abc123-file.jpg)
  const key = image.url.replace("/api/uploads/", "");
  if (key) {
    await storage.delete(key);
  }

  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
}

export async function updateAltText(
  id: string,
  altText: string,
  altTextAr: string
) {
  await prisma.galleryImage.update({
    where: { id },
    data: {
      altText: altText || null,
      altTextAr: altTextAr || null,
    },
  });

  revalidatePath("/admin/gallery");
}

export async function reorderGallery(
  items: { id: string; sortOrder: number }[]
) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.galleryImage.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  revalidatePath("/admin/gallery");
}
