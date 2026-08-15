import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/admin-session";

async function logout(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  cookieStore.set("hq_tenant_id", "", { path: "/", maxAge: 0 });
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export async function POST(request: NextRequest) {
  return logout(request);
}

export async function GET(request: NextRequest) {
  return logout(request);
}
