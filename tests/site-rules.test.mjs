import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scannedExts = new Set([".ts", ".tsx", ".css", ".mjs", ".json", ".md"]);
const ignoredDirs = new Set([".git", ".next", "node_modules"]);
const blockedEn = ["warr" + "anty", "warr" + "anties", "guar" + "antee", "guar" + "anteed"];
const blockedZh = ["质" + "保", "保" + "修", "质" + "保期", "保" + "修期", "质量" + "保证"];
const mojibake = ["鈥", "m" + "虏", "\uFFFD"];
const prohibited = new RegExp(`\\b(${blockedEn.join("|")})\\b|${[...blockedZh, ...mojibake].join("|")}`, "i");
const requiredFiles = [
  "app/news/page.tsx",
  "app/news/[slug]/page.tsx",
  "app/admin/login/page.tsx",
  "lib/products-db.ts",
  "lib/articles-db.ts",
  "lib/supabase.ts"
];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    if (entry.isFile() && scannedExts.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  throw new Error(`Missing required delivery files: ${missing.join(", ")}`);
}

const hits = [];
for (const file of walk(root)) {
  if (path.relative(root, file) === path.join("tests", "site-rules.test.mjs")) continue;
  const content = fs.readFileSync(file, "utf8");
  if (prohibited.test(content)) hits.push(path.relative(root, file));
}

if (hits.length) {
  throw new Error(`Prohibited or mojibake text found in: ${hits.join(", ")}`);
}

console.log("site-rules: ok");
