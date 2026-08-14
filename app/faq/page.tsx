import type { Metadata } from "next";
import { faqs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions for solar aluminum frame and custom aluminum profile procurement."
};

export default function FaqPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">FAQ</p>
          <h1>Procurement questions for solar aluminum frames</h1>
          <p className="hero-lead">Common questions about specifications, customization, samples, MOQ, production timing, and inspection coordination.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container faq-grid">
          {faqs.map((faq) => (
            <div className="faq-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
