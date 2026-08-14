import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Frame } from "lucide-react";
import { products, text } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Products",
  description: "Solar aluminum frames, black aluminum frames, and custom aluminum profile products for photovoltaic module manufacturers."
};

export default function ProductsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">Products</p>
          <h1>Solar aluminum frames and custom profiles</h1>
          <p className="hero-lead">Browse core product groups, then send drawings, specifications, and demand details for a project quotation.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container product-grid">
          {products.map((product) => (
            <Link className="product-card" href={`/products/${product.slug}`} key={product.slug}>
              <span className="icon-badge"><Frame size={24} /></span>
              <p className="eyebrow">{product.category}</p>
              <h3>{text(product.name)}</h3>
              <p>{text(product.summary)}</p>
              <span className="link-arrow">Open details <ArrowUpRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
