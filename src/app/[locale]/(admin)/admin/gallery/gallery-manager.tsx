"use client";

import { useTransition } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryGrid } from "@/components/admin/gallery-grid";
import { addGalleryImage } from "./actions";
import type { GalleryImage } from "@prisma/client";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [, startTransition] = useTransition();

  function handleUpload(url: string) {
    startTransition(() => addGalleryImage(url));
  }

  return (
    <div className="space-y-6">
      <ImageUpload onUpload={handleUpload} />
      <GalleryGrid images={images} />
    </div>
  );
}
