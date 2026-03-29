"use client";

import { useTransition } from "react";
import {
  markAsRead,
  deleteSubmission,
  deleteWhatsAppLead,
} from "@/app/[locale]/(admin)/admin/submissions/actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Trash2 } from "lucide-react";
import type { ContactSubmission, WhatsAppLead } from "@prisma/client";

export function ContactTable({
  submissions,
}: {
  submissions: ContactSubmission[];
}) {
  const [isPending, startTransition] = useTransition();

  if (submissions.length === 0) {
    return <p className="text-muted-foreground">No contact submissions yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((sub) => (
          <TableRow
            key={sub.id}
            className={sub.isRead ? "" : "bg-primary/5 font-medium"}
          >
            <TableCell>{sub.name}</TableCell>
            <TableCell>{sub.email || "—"}</TableCell>
            <TableCell>{sub.phone || "—"}</TableCell>
            <TableCell className="max-w-xs truncate">{sub.message}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(sub.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-end">
              <div className="flex justify-end gap-1">
                {!sub.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => startTransition(() => markAsRead(sub.id))}
                    disabled={isPending}
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startTransition(() => deleteSubmission(sub.id))}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function WhatsAppTable({ leads }: { leads: WhatsAppLead[] }) {
  const [isPending, startTransition] = useTransition();

  if (leads.length === 0) {
    return <p className="text-muted-foreground">No WhatsApp leads yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>{lead.name || "—"}</TableCell>
            <TableCell>{lead.phone}</TableCell>
            <TableCell className="text-muted-foreground">
              {lead.source || "—"}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(lead.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  startTransition(() => deleteWhatsAppLead(lead.id))
                }
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
