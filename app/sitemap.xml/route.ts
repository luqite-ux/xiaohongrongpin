import { listPublishedArticles } from "@/lib/articles-db";
import { listProducts } from "@/lib/products-db";

const routes = ["", "/products", "/capabilities", "/custom-solutions", "/quality-control", "/about", "/news", "/faq", "/contact"];

export const dynamic = "force-dynamic";

function xmlEscape(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] || char);
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xhrpaluminum.com";
  const now = new Date().toISOString();
  const [products, articles] = await Promise.all([listProducts(), listPublishedArticles(100)]);
  const urls = [
    ...routes.map((route) => ({ loc: `${baseUrl}${route}`, lastmod: now })),
    ...products.map((product) => ({ loc: `${baseUrl}/products/${product.slug}`, lastmod: now })),
    ...articles.map((article) => ({ loc: `${baseUrl}/news/${article.slug}`, lastmod: new Date(article.publishedAt || article.createdAt).toISOString() }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `<url><loc>${xmlEscape(url.loc)}</loc><lastmod>${xmlEscape(url.lastmod)}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, s-maxage=60, stale-while-revalidate=300"
    }
  });
}
