import Link from "next/link";
import { ArrowUpRight, Factory, Frame, Gauge, Settings2, ShieldCheck, SunMedium } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { Section } from "@/components/section";
import { capabilityStats, text } from "@/lib/site-data";
import { listPublishedArticles, formatArticleDate } from "@/lib/articles-db";
import { listProducts } from "@/lib/products-db";

export default async function HomePage() {
  const [products, articles] = await Promise.all([listProducts(), listPublishedArticles(3)]);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Bright precision for solar module manufacturing</p>
            <h1>Precision Aluminum Frames for Solar Module Manufacturers</h1>
            <p className="hero-lead">
              XiaoHongRongPin supplies solar aluminum frames and custom aluminum profiles for photovoltaic module production,
              combining automated capacity, drawing-based tooling, and responsive B2B engineering support.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="primary-button">Request a Quote <ArrowUpRight size={18} /></Link>
              <Link href="/custom-solutions" className="secondary-button">Send Your Drawing</Link>
            </div>
          </div>
          <div className="hero-panel" aria-label="Solar frame visual animation">
            <div className="scan-line" />
            <div className="frame-orbit" />
            <div className="hero-card">
              <p className="eyebrow">Solar frame focus</p>
              <h3>Automated lines for repeatable frame supply</h3>
              <p>Standard formats, black frame options, and special-shaped profiles can be reviewed for project production.</p>
            </div>
          </div>
        </div>
        <div className="container stats-grid">
          {capabilityStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Product gateway" title="Solar aluminum frame categories built for B2B procurement" intro="Start from standard frame formats, black frame programs, or drawing-based profiles. Every product path leads to a quotation conversation.">
        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-card" href={`/products/${product.slug}`} key={product.slug}>
              <span className="icon-badge"><Frame size={24} /></span>
              <p className="eyebrow">{product.category}</p>
              <h3>{text(product.name)}</h3>
              <p>{text(product.summary)}</p>
              <span className="link-arrow">View product <ArrowUpRight size={16} /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="blue" eyebrow="Manufacturing capacity" title="A focused production base for photovoltaic aluminum frames">
        <div className="feature-grid">
          <div className="feature-card">
            <span className="icon-badge"><Factory size={24} /></span>
            <h3>Automated Production</h3>
            <p>10 automated production lines and 2 custom production lines support repeatable solar frame output.</p>
          </div>
          <div className="feature-card">
            <span className="icon-badge"><Gauge size={24} /></span>
            <h3>Stable Scheduling</h3>
            <p>Reference production rhythm is usually 10-15 days depending on tooling status and order requirements.</p>
          </div>
          <div className="feature-card">
            <span className="icon-badge"><SunMedium size={24} /></span>
            <h3>PV Application Fit</h3>
            <p>Products are developed around solar photovoltaic module frames and aluminum component use cases.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Custom engineering" title="Drawing-based tooling for frame and profile projects" intro="Buyers can provide dimensions, target finish, module format, and drawings for engineering review before sampling and batch production.">
        <div className="feature-grid">
          {["Custom size, material, color, and process", "Sample approval before mass production", "Progress feedback during production"].map((item) => (
            <div className="feature-card" key={item}>
              <span className="icon-badge"><Settings2 size={24} /></span>
              <h3>{item}</h3>
              <p>Project details are confirmed by drawing review, technical communication, and production planning.</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white" eyebrow="Inspection workflow" title="Clear checks before shipment" intro="The quality page presents incoming material review, dimensional checks, surface inspection, production records, and third-party inspection coordination.">
        <div className="page-grid">
          <div className="page-card">
            <span className="icon-badge"><ShieldCheck size={24} /></span>
            <h3>Procurement confidence without online checkout</h3>
            <p>This site is designed for technical B2B inquiries. Buyers send drawings, quantities, and target schedules, then receive project-specific communication.</p>
            <Link href="/quality-control" className="link-arrow">Review quality process <ArrowUpRight size={16} /></Link>
          </div>
          <InquiryForm compact products={products} />
        </div>
      </Section>

      <Section eyebrow="Company updates" title="Latest news and project notes" intro="Published updates from the team will appear here automatically.">
        {articles.length ? (
          <div className="feature-grid">
            {articles.map((article) => (
              <Link className="feature-card" href={`/news/${article.slug}`} key={article.id}>
                <p className="eyebrow">{formatArticleDate(article)}</p>
                <h3>{article.title}</h3>
                <p>{article.excerpt || "Read the full company update."}</p>
                <span className="link-arrow">Read update <ArrowUpRight size={16} /></span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="page-card">
            <h3>No published news yet</h3>
            <p>Company updates will appear here after they are published from the admin dashboard.</p>
          </div>
        )}
      </Section>
    </main>
  );
}
