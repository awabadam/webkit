import { z } from "zod";

export const addGalleryImageSchema = z.object({
  url: z.string().min(1),
  key: z.string().optional(),
  altText: z.string().optional().default(""),
  altTextAr: z.string().optional().default(""),
});

export const updateAltTextSchema = z.object({
  id: z.string().min(1),
  altText: z.string().optional().default(""),
  altTextAr: z.string().optional().default(""),
});
