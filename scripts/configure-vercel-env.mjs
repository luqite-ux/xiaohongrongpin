#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ADMIN_ROOT = "D:/Cursor/Grand/huanqiu-admin";
const PROJECT_ID = "prj_Jidek4SRAu3MTYxJYYux1mnmwTw6";
const TENANT_ID = "df97d586-60b7-4d1b-891b-342b5e7a2da0";

function load(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) out[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return out;
}

function mergeNonEmpty(...objects) {
  const out = {};
  for (const object of objects) {
    for (const [key, value] of Object.entries(object)) {
      if (value) out[key] = value;
    }
  }
  return out;
}

const base = mergeNonEmpty(load(path.join(ADMIN_ROOT, ".env")), load(path.join(ADMIN_ROOT, ".env.local")), load(path.join(ADMIN_ROOT, "r2.env")));
const batch = load(path.join(ADMIN_ROOT, "_migrate-batch", ".env"));
const token = batch.VERCEL_TOKEN;
const team = batch.VERCEL_TEAM_ID || "team_v0pxRIIzSUGJleUTRNSz6GS4";
if (!token) throw new Error("Missing VERCEL_TOKEN");

async function api(method, endpoint, body) {
  const join = endpoint.includes("?") ? "&" : "?";
  const response = await fetch(`https://api.vercel.com${endpoint}${join}teamId=${team}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${endpoint}: HTTP ${response.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

const values = {
  NEXT_PUBLIC_SUPABASE_URL: base.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: base.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_TENANT_ID: TENANT_ID,
  NEXT_PUBLIC_ADMIN_URL: "https://admin.globle-trade.com",
  NEXT_PUBLIC_SITE_URL: "https://xiaohongrongpin.vercel.app",
  SUPABASE_SERVICE_ROLE_KEY: base.SUPABASE_SERVICE_ROLE_KEY
};

const existing = await api("GET", `/v9/projects/${PROJECT_ID}/env`);
for (const [key, value] of Object.entries(values)) {
  if (!value) throw new Error(`Missing ${key}`);
  for (const item of existing.envs.filter((entry) => entry.key === key)) {
    await api("DELETE", `/v9/projects/${PROJECT_ID}/env/${item.id}`);
  }
  await api("POST", `/v10/projects/${PROJECT_ID}/env`, {
    key,
    value,
    type: "encrypted",
    target: ["production", "preview", "development"]
  });
  console.log(`${key}: configured`);
}

const readback = await api("GET", `/v9/projects/${PROJECT_ID}/env`);
const configuredKeys = [...new Set(readback.envs.filter((entry) => Object.hasOwn(values, entry.key)).map((entry) => entry.key))].sort();
if (configuredKeys.length !== Object.keys(values).length) {
  throw new Error(`Environment readback mismatch: ${configuredKeys.join(",")}`);
}
console.log(JSON.stringify({ projectId: PROJECT_ID, tenantId: TENANT_ID, configuredKeys }, null, 2));
