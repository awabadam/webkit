"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  deleteService,
  togglePublish,
  reorderServices,
} from "@/app/[locale]/(admin)/admin/services/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@prisma/client";

export function ServicesList({ services }: { services: Service[] }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  function handleDelete(id: string) {
    startTransition(() => deleteService(id));
  }

  function handleToggle(id: string) {
    startTransition(() => togglePublish(id));
  }

  function handleReorder(index: number, direction: "up" | "down") {
    const items = [...services];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const updated = items.map((item, i) => ({
      id: item.id,
      sortOrder:
        i === index
          ? items[swapIndex].sortOrder
          : i === swapIndex
            ? items[index].sortOrder
            : item.sortOrder,
    }));

    startTransition(() => reorderServices(updated));
  }

  if (services.length === 0) {
    return (
      <p className="text-muted-foreground">
        No services yet.{" "}
        <Link href={`/${locale}/admin/services/new`} className="underline">
          Create your first service
        </Link>
        .
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Order</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service, index) => (
          <TableRow key={service.id}>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === 0 || isPending}
                  onClick={() => handleReorder(index, "up")}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === services.length - 1 || isPending}
                  onClick={() => handleReorder(index, "down")}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell className="text-muted-foreground">{service.slug}</TableCell>
            <TableCell>
              <Badge
                variant={service.isPublished ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => handleToggle(service.id)}
              >
                {service.isPublished ? "Published" : "Draft"}
              </Badge>
            </TableCell>
            <TableCell className="text-end">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/${locale}/admin/services/${service.id}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <Dialog>
                  <DialogTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete service?</DialogTitle>
                      <DialogDescription>
                        This will permanently delete &quot;{service.title}&quot;. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose className={buttonVariants({ variant: "outline" })}>
                        Cancel
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(service.id)}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
