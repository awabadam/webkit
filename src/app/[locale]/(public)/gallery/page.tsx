import { prisma } from "@/lib/db/client";
import { GalleryLightbox } from "@/components/public/gallery-lightbox";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Gallery</h1>
      {images.length === 0 ? (
        <p className="text-muted-foreground">No images yet.</p>
      ) : (
        <GalleryLightbox images={images} />
      )}
    </div>
  );
}
