import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAdminPath = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout");
  const needsSession = !isPublicAdminPath && pathname.startsWith("/admin");

  if (needsSession && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
