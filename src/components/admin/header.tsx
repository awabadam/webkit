import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/app/[locale]/(auth)/admin/login/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export async function AdminHeader() {
  const user = await getCurrentUser();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user?.name ?? user?.email}
        </span>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" type="submit">
            <LogOut className="h-4 w-4 me-2" />
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
