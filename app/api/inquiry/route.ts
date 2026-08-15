import { NextResponse } from "next/server";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const required = ["name", "company", "email", "message"];
const fields = ["name", "company", "email", "phone", "country", "product", "quantity", "message"];

export async function POST(request: Request) {
  const form = await request.formData();
  const missing = required.filter((key) => !String(form.get(key) || "").trim());
  const wantsJson = request.headers.get("accept")?.includes("application/json");

  if (missing.length > 0) {
    if (wantsJson) return jsonResponse("Please complete the required fields", `Missing fields: ${missing.join(", ")}.`, 400);
    return htmlResponse("Please complete the required fields", `Missing fields: ${missing.join(", ")}.`, 400);
  }

  const payload = Object.fromEntries(fields.map((key) => [key, String(form.get(key) || "").trim()]));
  const saved = await saveInquiry(payload);
  if (!saved.ok) {
    if (wantsJson) return jsonResponse("Inquiry could not be saved", saved.message, 500);
    return htmlResponse("Inquiry could not be saved", saved.message, 500);
  }

  if (wantsJson) {
    return jsonResponse(
      "Inquiry received",
      "Thank you. Your project details were received. The team can now review your solar aluminum frame request."
    );
  }

  return htmlResponse(
    "Inquiry received",
    "Thank you. Your project details were received by the website endpoint. The team can now review your solar aluminum frame request."
  );
}

function jsonResponse(title: string, message: string, status = 200) {
  return NextResponse.json({ title, message }, { status });
}

async function saveInquiry(payload: Record<string, string>): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

  if (supabaseUrl && anonKey && tenantId) {
    const supabase = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const details = [
      payload.message,
      payload.country ? `Country: ${payload.country}` : "",
      payload.product ? `Product interest: ${payload.product}` : "",
      payload.quantity ? `Quantity / annual demand: ${payload.quantity}` : ""
    ].filter(Boolean).join("\n\n");

    const { error } = await supabase.from("inquiries").insert({
      tenant_id: tenantId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      subject: payload.product || "Website inquiry",
      message: details,
      status: "unread"
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  }

  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "inquiries.jsonl"), `${JSON.stringify({ ...payload, createdAt: new Date().toISOString() })}\n`, "utf8");
  return { ok: true };
}

function htmlResponse(title: string, message: string, status = 200) {
  return new NextResponse(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | XiaoHongRongPin</title>
  <style>
    body{margin:0;font-family:Arial,Helvetica,sans-serif;color:#102338;background:linear-gradient(135deg,#f8fcff,#eaf7ff);min-height:100vh;display:grid;place-items:center;padding:24px}
    main{max-width:640px;background:white;border:1px solid #d8e5ef;border-radius:12px;box-shadow:0 24px 80px rgba(16,35,56,.14);padding:34px}
    h1{margin:0 0 12px;font-size:34px;letter-spacing:0}
    p{color:#52697d;line-height:1.7}
    a{display:inline-flex;margin-top:18px;color:white;background:linear-gradient(135deg,#0e5a8a,#1c86c8);padding:13px 20px;border-radius:999px;text-decoration:none;font-weight:800}
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/contact">Back to contact</a>
  </main>
</body>
</html>`, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);
}
