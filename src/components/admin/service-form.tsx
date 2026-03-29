"use client";

import { useActionState, useState } from "react";
import {
  createService,
  updateService,
  type ServiceState,
} from "@/app/[locale]/(admin)/admin/services/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils/slugify";
import { ImageUpload } from "@/components/admin/image-upload";
import Image from "next/image";
import type { Service } from "@prisma/client";

const initialState: ServiceState = {};

export function ServiceForm({ service }: { service?: Service }) {
  const action = service ? updateService : createService;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [isPublished, setIsPublished] = useState(service?.isPublished ?? true);
  const [imageUrl, setImageUrl] = useState(service?.imageUrl ?? "");

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {service && <input type="hidden" name="id" value={service.id} />}
      <input type="hidden" name="isPublished" value={isPublished ? "true" : "false"} />

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={service?.title ?? ""}
                  onChange={(e) => {
                    if (!service) setSlug(slugify(e.target.value));
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={service?.description ?? ""}
                  rows={6}
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="titleAr">Title (Arabic)</Label>
                <Input
                  id="titleAr"
                  name="titleAr"
                  defaultValue={service?.titleAr ?? ""}
                  dir="rtl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                <Textarea
                  id="descriptionAr"
                  name="descriptionAr"
                  defaultValue={service?.descriptionAr ?? ""}
                  rows={6}
                  dir="rtl"
                  required
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly name. Auto-generated from title if left empty.
            </p>
          </div>

          <input type="hidden" name="imageUrl" value={imageUrl} />
          <div className="space-y-2">
            <Label>Service Image</Label>
            {imageUrl && (
              <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                <Image
                  src={imageUrl}
                  alt="Service image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <ImageUpload onUpload={(url) => setImageUrl(url)} />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : service ? "Update Service" : "Create Service"}
      </Button>
    </form>
  );
}
