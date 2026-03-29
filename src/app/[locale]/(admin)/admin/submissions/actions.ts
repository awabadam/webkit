"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";

export async function markAsRead(id: string) {
  await prisma.contactSubmission.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string) {
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/submissions");
}

export async function deleteWhatsAppLead(id: string) {
  await prisma.whatsAppLead.delete({ where: { id } });
  revalidatePath("/admin/submissions");
}
