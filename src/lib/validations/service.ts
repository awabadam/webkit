import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  slug: z.string().optional(),
  imageUrl: z.string().optional().default(""),
  isPublished: z.coerce.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.extend({
  id: z.string().min(1),
});

export const reorderSchema = z.array(
  z.object({
    id: z.string(),
    sortOrder: z.number(),
  })
);

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
