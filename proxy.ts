import { NextResponse as ServiceGuardNextResponse, type NextRequest as ServiceGuardRequest } from 'next/server'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from './lib/service-status'
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-session";

function existingServiceExpiryIntegration(request: NextRequest) {
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

export async function proxy(request: ServiceGuardRequest) {
  if (!isServiceGuardExcludedPath(request.nextUrl.pathname) && !await isWebsiteServiceAvailable()) return ServiceGuardNextResponse.rewrite(new URL('/service-expired', request.url))
  return existingServiceExpiryIntegration(request)
}
