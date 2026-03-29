"use client";

import { useTransition } from "react";
import Image from "next/image";
import { deleteGalleryImage } from "@/app/[locale]/(admin)/admin/gallery/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { GalleryImage } from "@prisma/client";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(() => deleteGalleryImage(id));
  }

  if (images.length === 0) {
    return (
      <p className="text-muted-foreground">
        No images yet. Upload your first image above.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
        >
          <Image
            src={image.url}
            alt={image.altText ?? "Gallery image"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDelete(image.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
