"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsState } from "@/app/[locale]/(admin)/admin/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SiteSettings } from "@prisma/client";

const initialState: SettingsState = {};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  multiline = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  multiline?: boolean;
}) {
  const Component = multiline ? Textarea : Input;
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Component
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
      />
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(
    updateSettings,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 mt-4">
              <Field label="Business Name" name="businessName" defaultValue={settings?.businessName} />
              <Field label="Address" name="address" defaultValue={settings?.address} multiline />
            </TabsContent>
            <TabsContent value="ar" className="space-y-4 mt-4">
              <Field label="Business Name (Arabic)" name="businessNameAr" defaultValue={settings?.businessNameAr} />
              <Field label="Address (Arabic)" name="addressAr" defaultValue={settings?.addressAr} multiline />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Phone" name="phone" type="tel" defaultValue={settings?.phone} />
          <Field label="WhatsApp Number" name="whatsappNumber" type="tel" defaultValue={settings?.whatsappNumber} />
          <Field label="Email" name="email" type="email" defaultValue={settings?.email} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Facebook" name="socialFacebook" defaultValue={settings?.socialFacebook} />
          <Field label="Instagram" name="socialInstagram" defaultValue={settings?.socialInstagram} />
          <Field label="Twitter / X" name="socialTwitter" defaultValue={settings?.socialTwitter} />
          <Field label="LinkedIn" name="socialLinkedin" defaultValue={settings?.socialLinkedin} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 mt-4">
              <Field label="Meta Title" name="metaTitle" defaultValue={settings?.metaTitle} />
              <Field label="Meta Description" name="metaDescription" defaultValue={settings?.metaDescription} multiline />
            </TabsContent>
            <TabsContent value="ar" className="space-y-4 mt-4">
              <Field label="Meta Title (Arabic)" name="metaTitleAr" defaultValue={settings?.metaTitleAr} />
              <Field label="Meta Description (Arabic)" name="metaDescriptionAr" defaultValue={settings?.metaDescriptionAr} multiline />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Field label="Logo URL" name="logoUrl" defaultValue={settings?.logoUrl} />

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
