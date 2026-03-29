import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { routing } from "@/lib/i18n/config";
import type { SessionData } from "@/lib/auth/session";

const intlMiddleware = createMiddleware(routing);

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "webkit-session",
};

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = /^\/(en|ar)\/admin(?!\/(login))/.test(pathname);

  if (isAdminRoute) {
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    );

    if (!session.userId) {
      const locale = pathname.split("/")[1];
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
