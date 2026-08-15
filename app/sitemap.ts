import type { MetadataRoute } from "next";
import { products } from "@/lib/site-data";

const routes = ["", "/products", "/capabilities", "/custom-solutions", "/quality-control", "/about", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xhrpaluminum.com";
  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date()
    }))
  ];
}
