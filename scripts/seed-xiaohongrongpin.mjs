#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const requireFromAdmin = createRequire("D:/Cursor/Grand/huanqiu-admin/package.json");
const { createClient } = requireFromAdmin("@supabase/supabase-js");
const { PutObjectCommand, S3Client } = requireFromAdmin("@aws-sdk/client-s3");
const bcrypt = requireFromAdmin("bcryptjs");

const ADMIN_ROOT = "D:/Cursor/Grand/huanqiu-admin";
const SITE_ROOT = "D:/Cursor/Grand/xiaohongrongpin";
const DOMAIN = "xhrpaluminum.com";
const ADMIN_EMAIL = `info@${DOMAIN}`;
const PASSWORD = "info12345";
const blockedZh = ["质" + "保", "保" + "修", "质量" + "保证"];
const blockedEn = ["warr" + "ant(?:y|ies)", "guar" + "antee(?:d|s|ing)?"];
const prohibited = [
  ...blockedZh.map((word) => new RegExp(word, "i")),
  ...blockedEn.map((word) => new RegExp(`\\b${word}\\b`, "i"))
];

function loadEnv() {
  for (const file of [
    path.join(ADMIN_ROOT, ".env.local"),
    path.join(ADMIN_ROOT, ".env"),
    path.join(ADMIN_ROOT, "_migrate-batch", ".env"),
    path.join(ADMIN_ROOT, "r2.env")
  ]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

function assertSafe(value) {
  const body = JSON.stringify(value);
  const hits = prohibited.filter((pattern) => pattern.test(body)).map(String);
  if (hits.length) throw new Error(`Prohibited public content detected: ${hits.join(", ")}`);
}

function publicUrl(base, key) {
  return `${base.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

const categories = [
  {
    slug: "solar-aluminum-frames",
    name: "Solar Aluminum Frames",
    description: "Aluminum frame profiles for photovoltaic module assembly, including long-side and short-side frame sets."
  },
  {
    slug: "black-aluminum-frames",
    name: "Black Aluminum Frames",
    description: "Black surface finish aluminum frames for appearance-focused solar module programs."
  },
  {
    slug: "custom-aluminum-profiles",
    name: "Custom Aluminum Profiles",
    description: "Drawing-based aluminum profiles and special-shaped aluminum components for B2B projects."
  }
];

const products = [
  {
    slug: "high-performance-solar-frame-set",
    categorySlug: "solar-aluminum-frames",
    name: "High-Performance Long & Short Side Solar Frame Set",
    description: "Matched long-side and short-side aluminum frame profiles for photovoltaic module assembly, available for mainstream module formats and project-specific tooling.",
    specs: { "Reference specs": "2384*33*28-6.1 AA10; 1303*33*16-6.1 AA10; 2382*30*28-6.1 AA10; 1134*30*11.5-6.1 AA10" },
    features: ["Mainstream module formats", "Drawing-based tooling", "Profile matching for long and short sides"],
    applications: ["Solar PV modules", "Utility-scale module production", "Distributed photovoltaic projects"],
    advantages: ["Automated production support", "Stable batch communication", "Technical data available on request"]
  },
  {
    slug: "standard-solar-aluminum-frame",
    categorySlug: "solar-aluminum-frames",
    name: "Standard Solar Aluminum Frame",
    description: "Bright anodized aluminum frames for solar panel manufacturing, designed for repeatable assembly, clean edges, and scalable procurement.",
    specs: { "Reference specs": "2384*35*35mm >=10um; 1092*35*16mm >=10um; 2384*35*30mm >=10um; 1092*35*16mm >=10um" },
    features: ["Anodized finish options", "Standard and custom dimensions", "Batch-ready packaging"],
    applications: ["PV panel perimeter frames", "Solar component manufacturing", "OEM module supply chains"],
    advantages: ["10 automated production lines", "2 custom production lines", "Monthly capacity reference: 600,000 sets"]
  },
  {
    slug: "black-solar-aluminum-frame",
    categorySlug: "black-aluminum-frames",
    name: "Black Solar Aluminum Frame",
    description: "Black AA15 aluminum frame options for solar modules where a refined exterior appearance and consistent finishing are required.",
    specs: { "Reference specs": "1762*30*30-5.2 black AA15; 1134*30*30-5.2 black AA15; 1762*30*30-5.0 black AA15; 1134*30*30-5.0 black AA15" },
    features: ["Black surface finish", "Multiple profile depths", "Project-specific frame matching"],
    applications: ["Residential solar modules", "Commercial rooftop PV", "Appearance-focused module programs"],
    advantages: ["Clear finish communication", "Pre-shipment inspection records", "Custom order review"]
  },
  {
    slug: "special-shaped-aluminum-profile",
    categorySlug: "custom-aluminum-profiles",
    name: "Special-Shaped Aluminum Profile",
    description: "Custom-shaped aluminum profiles produced from buyer drawings for photovoltaic accessories and industrial aluminum component projects.",
    specs: { "Reference specs": "163.5*59.3*35.5; 106.7*26*56*111.4; 57.2*50*78.1" },
    features: ["Custom tooling support", "Profile engineering review", "Small-batch sampling before mass production"],
    applications: ["Solar module accessories", "Industrial aluminum assemblies", "Drawing-based OEM parts"],
    advantages: ["Drawing review", "Production progress feedback", "Project-specific process planning"]
  }
];

const tenantPayload = (logoUrl) => ({
  name: "xiaohongrongpin",
  display_name: "杭州萧宏荣品铝业有限公司",
  domain: DOMAIN,
  email: ADMIN_EMAIL,
  brand_color: "#0E5A8A",
  logo_url: logoUrl,
  favicon_url: logoUrl,
  default_language: "en",
  supported_languages: ["en"],
  admin_group: 2,
  contact_email: "1514070298@qq.com",
  contact_phone: "13805786675",
  contact_whatsapp: null,
  contact_address_short: "Jiande, Hangzhou, Zhejiang, China",
  contact_address_i18n: { en: "No. 2 Extrusion Workshop, Houshan Industrial Park, Qiantan Town, Jiande, Hangzhou, Zhejiang, China" },
  social_links: {},
  site_title_i18n: { en: "XiaoHongRongPin | Solar Aluminum Frame Manufacturer" },
  site_tagline_i18n: { en: "Precision solar aluminum frames for module manufacturers" },
  site_description_i18n: { en: "Hangzhou Xiaohongrongpin Aluminum Industry Co., Ltd. manufactures solar aluminum frames and custom aluminum profiles for photovoltaic module production." },
  seo_title_i18n: { en: "XiaoHongRongPin | Solar Aluminum Frame Manufacturer" },
  seo_description_i18n: { en: "Solar aluminum frames, black aluminum frames, and drawing-based custom aluminum profiles for photovoltaic module manufacturers." },
  seo_keywords_i18n: { en: "solar aluminum frame, photovoltaic aluminum frame, black solar frame, custom aluminum profile, PV module frame manufacturer" },
  google_analytics_id: null,
  google_tag_manager_id: null,
  extra_settings: {
    source: "customer XLSX, company profile DOCX, and Codex delivery",
    initialized_at: new Date().toISOString(),
    manually_maintained_fields: [],
    formal_domain: DOMAIN,
    production_url: `https://${DOMAIN}`
  },
  notes: "English launch with future multilingual expansion reserved through i18n JSONB fields."
});

async function uploadLogo(r2, bucket, publicBase) {
  const source = path.join(SITE_ROOT, "public", "logo.png");
  const key = "tenants/xiaohongrongpin/brand/logo.png";
  await r2.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fs.readFileSync(source),
    ContentType: "image/png",
    CacheControl: "public, max-age=31536000, immutable"
  }));
  return publicUrl(publicBase, key);
}

function checked(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
}

async function main() {
  loadEnv();
  for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "R2_S3_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]) {
    if (!process.env[key]) throw new Error(`Missing ${key}`);
  }
  const bucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_URL_PREFIX || process.env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX || process.env.R2_PUBLIC_URL;
  if (!bucket) throw new Error("Missing R2 bucket");
  if (!publicBase) throw new Error("Missing R2 public URL prefix");

  const dryRun = process.argv.includes("--dry-run");
  const plan = { tenant: tenantPayload(null), categories, products, adminEmail: ADMIN_EMAIL };
  assertSafe(plan);
  if (dryRun) {
    console.log(JSON.stringify({ mode: "dry-run", domain: DOMAIN, adminEmail: ADMIN_EMAIL, categoryCount: categories.length, productCount: products.length }, null, 2));
    return;
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_S3_ENDPOINT,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
  });

  const existingTenant = await db.from("tenants").select("id,domain").eq("domain", DOMAIN).maybeSingle();
  checked(existingTenant, "Tenant preflight");
  const existingAdmin = await db.from("admin_users").select("id,email,tenant_id").eq("email", ADMIN_EMAIL).maybeSingle();
  checked(existingAdmin, "Admin preflight");

  const logoUrl = await uploadLogo(r2, bucket, publicBase);
  const hash = await bcrypt.hash(PASSWORD, 12);
  let tenantId = existingTenant.data?.id;
  if (tenantId) {
    const updated = await db.from("tenants").update(tenantPayload(logoUrl)).eq("id", tenantId).eq("domain", DOMAIN).select("id").single();
    checked(updated, "Tenant update");
  } else {
    const inserted = await db.from("tenants").insert({ ...tenantPayload(logoUrl), password_hash: hash }).select("id").single();
    checked(inserted, "Tenant insert");
    tenantId = inserted.data.id;
  }

  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    const result = await db.from("product_categories").upsert({
      tenant_id: tenantId,
      slug: category.slug,
      name: category.name,
      name_en: category.name,
      name_i18n: { en: category.name },
      description: category.description,
      description_en: category.description,
      description_i18n: { en: category.description },
      icon: logoUrl,
      parent_id: null,
      sort_order: index,
      is_active: true
    }, { onConflict: "tenant_id,slug" });
    checked(result, `Category ${category.slug}`);
  }

  const categoryMap = new Map(categories.map((category) => [category.slug, category.name]));
  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    const result = await db.from("products").upsert({
      tenant_id: tenantId,
      slug: product.slug,
      model: product.slug.toUpperCase().slice(0, 32),
      category: categoryMap.get(product.categorySlug),
      category_slug: product.categorySlug,
      name: product.name,
      name_en: product.name,
      name_i18n: { en: product.name },
      description: product.description,
      description_en: product.description,
      description_i18n: { en: product.description },
      overview: product.description,
      overview_en: product.description,
      overview_i18n: { en: product.description },
      features: product.features,
      features_i18n: { en: product.features },
      applications: product.applications,
      applications_i18n: { en: product.applications },
      advantages: product.advantages,
      advantages_i18n: { en: product.advantages },
      specs: product.specs,
      image_url: logoUrl,
      extra_data: { images: [logoUrl], source: "XiaoHongRongPin customer materials", multilingual_ready: true },
      sort_order: index,
      is_active: true
    }, { onConflict: "tenant_id,slug" });
    checked(result, `Product ${product.slug}`);
  }

  const adminPayload = {
    email: ADMIN_EMAIL,
    name: "杭州萧宏荣品铝业有限公司管理员",
    role: "admin",
    tenant_id: tenantId,
    is_active: true,
    admin_group: 2,
    must_change_password: false
  };
  if (existingAdmin.data) {
    if (existingAdmin.data.tenant_id && existingAdmin.data.tenant_id !== tenantId) throw new Error(`${ADMIN_EMAIL} belongs to another tenant`);
    const result = await db.from("admin_users").update(adminPayload).eq("id", existingAdmin.data.id).eq("tenant_id", tenantId);
    checked(result, "Admin update");
  } else {
    const result = await db.from("admin_users").insert({ ...adminPayload, password_hash: hash });
    checked(result, "Admin insert");
  }

  const [tenantRead, categoriesRead, productsRead, adminRead] = await Promise.all([
    db.from("tenants").select("id,display_name,domain,admin_group,logo_url,favicon_url,default_language,supported_languages,contact_email,contact_phone,site_title_i18n,seo_title_i18n").eq("id", tenantId).single(),
    db.from("product_categories").select("slug,icon,name_i18n").eq("tenant_id", tenantId),
    db.from("products").select("slug,image_url,name_i18n,description_i18n,features_i18n,applications_i18n,advantages_i18n").eq("tenant_id", tenantId),
    db.from("admin_users").select("email,tenant_id,admin_group,is_active").eq("tenant_id", tenantId).eq("email", ADMIN_EMAIL).single()
  ]);
  for (const [result, label] of [[tenantRead, "tenant"], [categoriesRead, "categories"], [productsRead, "products"], [adminRead, "admin"]]) checked(result, `${label} readback`);

  const out = { tenant: tenantRead.data, categoryCount: categoriesRead.data.length, productCount: productsRead.data.length, admin: adminRead.data, password: PASSWORD };
  assertSafe(out);
  if (tenantRead.data.admin_group !== 2) throw new Error("admin_group readback mismatch");
  if (tenantRead.data.default_language !== "en" || JSON.stringify(tenantRead.data.supported_languages) !== JSON.stringify(["en"])) throw new Error("language readback mismatch");
  if (categoriesRead.data.length !== categories.length || productsRead.data.length !== products.length) throw new Error("content count readback mismatch");
  console.log(JSON.stringify(out, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
