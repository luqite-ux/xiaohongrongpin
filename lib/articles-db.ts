import { getSupabaseClient, getTenantId } from "@/lib/supabase";
import { pickI18nString } from "@/lib/i18n";

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type ArticleFull = ArticleSummary & {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function displayDate(article: ArticleSummary) {
  return article.publishedAt || article.createdAt;
}

export function formatArticleDate(article: ArticleSummary): string {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(displayDate(article)));
}

export async function listPublishedArticles(limit = 50): Promise<ArticleSummary[]> {
  const tenantId = getTenantId();
  const supabase = getSupabaseClient();
  if (!tenantId || !supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_i18n,excerpt,excerpt_i18n,featured_image,published_at,created_at")
    .eq("tenant_id", tenantId)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[articles-db] listPublishedArticles failed:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: pickI18nString(row.title_i18n) || row.title || "Company Update",
    excerpt: pickI18nString(row.excerpt_i18n) || row.excerpt || "",
    featuredImage: row.featured_image || null,
    publishedAt: row.published_at,
    createdAt: row.created_at
  }));
}

export async function getArticleBySlug(slug: string): Promise<ArticleFull | null> {
  const tenantId = getTenantId();
  const supabase = getSupabaseClient();
  if (!tenantId || !supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_i18n,excerpt,excerpt_i18n,content,content_en,content_i18n,featured_image,published_at,created_at,seo_title,seo_description")
    .eq("tenant_id", tenantId)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[articles-db] getArticleBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: pickI18nString(data.title_i18n) || data.title || "Company Update",
    excerpt: pickI18nString(data.excerpt_i18n) || data.excerpt || "",
    content: pickI18nString(data.content_i18n) || data.content_en || data.content || "",
    featuredImage: data.featured_image || null,
    publishedAt: data.published_at,
    createdAt: data.created_at,
    seoTitle: data.seo_title || null,
    seoDescription: data.seo_description || null
  };
}
