import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { products, text } from "@/lib/site-data";
import { getProductBySlug, listProducts } from "@/lib/products-db";

export const revalidate = 60;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: text(product.name),
    description: text(product.summary)
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const products = await listProducts();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">{product.category}</p>
          <h1>{text(product.name)}</h1>
          <p className="hero-lead">{text(product.summary)}</p>
          <Link href="/contact" className="primary-button">Request this product <ArrowUpRight size={18} /></Link>
        </div>
      </section>
      <section className="section section-light">
        <div className="container page-grid">
          <div className="spec-grid">
            <div className="spec-card">
              <h3>Reference Specifications</h3>
              <ul>{product.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul>
            </div>
            <div className="spec-card">
              <h3>Applications</h3>
              <ul>{product.applications.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="spec-card">
              <h3>Project Highlights</h3>
              <ul>{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="spec-card">
              <h3>Inquiry Notes</h3>
              <p>For accurate review, include drawings, target dimensions, finish, order quantity, packaging needs, and destination market.</p>
            </div>
          </div>
          <InquiryForm compact products={products} defaultProduct={text(product.name)} />
        </div>
      </section>
    </main>
  );
}
