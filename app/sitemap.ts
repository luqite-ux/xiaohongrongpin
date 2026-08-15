import type { MetadataRoute } from "next";
import { listPublishedArticles } from "@/lib/articles-db";
import { listProducts } from "@/lib/products-db";

const routes = ["", "/products", "/capabilities", "/custom-solutions", "/quality-control", "/about", "/news", "/faq", "/contact"];

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xhrpaluminum.com";
  const [products, articles] = await Promise.all([listProducts(), listPublishedArticles(100)]);
  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date()
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.publishedAt || article.createdAt)
    }))
  ];
}
