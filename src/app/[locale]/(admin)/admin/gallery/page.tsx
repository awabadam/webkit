import { prisma } from "@/lib/db/client";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery</h1>
      <GalleryManager images={images} />
    </div>
  );
}
