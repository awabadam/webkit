import { prisma } from "@/lib/db/client";
import { ExternalLink } from "lucide-react";

export async function PublicFooter() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const socials = [
    { url: settings?.socialFacebook, label: "Facebook" },
    { url: settings?.socialInstagram, label: "Instagram" },
    { url: settings?.socialTwitter, label: "Twitter" },
    { url: settings?.socialLinkedin, label: "LinkedIn" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-bold text-lg mb-2">
              {settings?.businessName || "Webkit"}
            </h3>
            {settings?.address && (
              <p className="text-sm text-muted-foreground">{settings.address}</p>
            )}
          </div>

          <div>
            {settings?.phone && (
              <p className="text-sm text-muted-foreground">
                Phone: {settings.phone}
              </p>
            )}
            {settings?.email && (
              <p className="text-sm text-muted-foreground">
                Email: {settings.email}
              </p>
            )}
          </div>

          {socials.length > 0 && (
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {settings?.businessName || "Webkit"}.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}
