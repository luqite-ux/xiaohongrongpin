import { getSupabaseClient, getTenantId } from "@/lib/supabase";
import { pickI18nArray, pickI18nString } from "@/lib/i18n";
import { products as fallbackProducts, type Product } from "@/lib/site-data";

type ProductRow = {
  slug: string;
  category: string | null;
  name: string | null;
  name_en: string | null;
  name_i18n: unknown;
  description: string | null;
  description_en: string | null;
  description_i18n: unknown;
  overview: string | null;
  overview_en: string | null;
  overview_i18n: unknown;
  features: unknown;
  features_i18n: unknown;
  applications: unknown;
  applications_i18n: unknown;
  advantages: unknown;
  advantages_i18n: unknown;
  specs: unknown;
};

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  return [];
}

function specsToArray(value: unknown): string[] {
  if (Array.isArray(value)) return stringArray(value);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  }
  return [];
}

function rowToProduct(row: ProductRow): Product {
  const name = pickI18nString(row.name_i18n) || row.name_en || row.name || "";
  const summary = pickI18nString(row.description_i18n) || pickI18nString(row.overview_i18n) || row.description_en || row.overview_en || row.description || row.overview || "";
  return {
    slug: row.slug,
    category: row.category || "Solar Aluminum Frames",
    name: { en: name },
    summary: { en: summary },
    specs: specsToArray(row.specs),
    applications: pickI18nArray(row.applications_i18n).length ? pickI18nArray(row.applications_i18n) : stringArray(row.applications),
    highlights: pickI18nArray(row.advantages_i18n).length
      ? pickI18nArray(row.advantages_i18n)
      : pickI18nArray(row.features_i18n).length
        ? pickI18nArray(row.features_i18n)
        : [...stringArray(row.advantages), ...stringArray(row.features)].slice(0, 6)
  };
}

export async function listProducts(): Promise<Product[]> {
  const tenantId = getTenantId();
  const supabase = getSupabaseClient();
  if (!tenantId || !supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select("slug,category,name,name_en,name_i18n,description,description_en,description_i18n,overview,overview_en,overview_i18n,features,features_i18n,applications,applications_i18n,advantages,advantages_i18n,specs,sort_order")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[products-db] listProducts failed:", error.message);
    return fallbackProducts;
  }
  return data?.length ? (data as ProductRow[]).map(rowToProduct) : fallbackProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await listProducts();
  return products.find((product) => product.slug === slug) || null;
}
