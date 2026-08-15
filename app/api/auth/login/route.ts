import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE } from "@/lib/admin-session";
import { getTenantId } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase/server";

const SESSION_DAYS = 7;

function loginError(request: NextRequest, message: string) {
  const target = new URL("/admin/login", request.url);
  target.searchParams.set("error", message);
  return NextResponse.redirect(target, 303);
}

export async function POST(request: NextRequest) {
  let email = "";
  let password = "";
  try {
    const form = await request.formData();
    email = String(form.get("email") || "").trim().toLowerCase();
    password = String(form.get("password") || "");
  } catch {
    return loginError(request, "Invalid request format");
  }

  if (!email || !password) return loginError(request, "Please enter both email and password");
  const tenantId = getTenantId();
  if (!tenantId) return loginError(request, "Site not configured");

  const supabase = createAdminClient();
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id,email,password_hash,is_active,tenant_id")
    .eq("email", email)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !user) return loginError(request, "Incorrect email or password");
  if (!user.is_active) return loginError(request, "Account disabled. Contact an administrator.");

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return loginError(request, "Incorrect email or password");

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const { error: insertErr } = await supabase.from("admin_user_sessions").insert({
    admin_user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "",
    user_agent: request.headers.get("user-agent") || ""
  });
  if (insertErr) return loginError(request, `Login failed: ${insertErr.message}`);

  await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || "https://admin.globle-trade.com";
  const handoffUrl = new URL("/auth/handoff", adminUrl);
  handoffUrl.searchParams.set("token", token);

  const response = NextResponse.redirect(handoffUrl, 303);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: expiresAt,
    path: "/"
  };
  response.cookies.set(SESSION_COOKIE, token, cookieOptions);
  response.cookies.set("hq_tenant_id", tenantId, cookieOptions);
  return response;
}
