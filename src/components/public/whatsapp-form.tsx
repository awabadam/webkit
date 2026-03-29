"use client";

import { useActionState, useEffect } from "react";
import { submitWhatsAppLead, type WhatsAppState } from "@/app/[locale]/(public)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";

const initialState: WhatsAppState = {};

export function WhatsAppForm({ source }: { source?: string }) {
  const [state, formAction, pending] = useActionState(
    submitWhatsAppLead,
    initialState
  );

  useEffect(() => {
    if (state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state.redirectUrl]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <input type="hidden" name="source" value={source || "contact"} />

      <div className="space-y-2">
        <Label htmlFor="wa-name">Name (optional)</Label>
        <Input id="wa-name" name="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wa-phone">Phone Number</Label>
        <Input id="wa-phone" name="phone" type="tel" required placeholder="+1234567890" />
      </div>

      <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700">
        <MessageCircle className="h-4 w-4 me-2" />
        {pending ? "Connecting..." : "Chat on WhatsApp"}
      </Button>
    </form>
  );
}
