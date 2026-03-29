"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split("/")[1];
  const targetLocale = currentLocale === "ar" ? "en" : "ar";
  const targetLabel = currentLocale === "ar" ? "EN" : "عربي";

  function switchLocale() {
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);
    router.push(newPath);
  }

  return (
    <Button variant="ghost" size="sm" onClick={switchLocale}>
      <Globe className="h-4 w-4 me-1" />
      {targetLabel}
    </Button>
  );
}
