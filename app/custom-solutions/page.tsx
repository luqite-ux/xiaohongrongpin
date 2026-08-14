import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Solutions",
  description: "Drawing-based custom aluminum frame and aluminum profile solutions for B2B solar and industrial projects."
};

export default function CustomSolutionsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">Custom Solutions</p>
          <h1>Send drawings for custom aluminum frame production</h1>
          <p className="hero-lead">Custom dimensions, materials, colors, processes, and tooling can be reviewed for solar frame and profile programs.</p>
          <Link href="/contact" className="primary-button">Send Your Drawing <ArrowUpRight size={18} /></Link>
        </div>
      </section>
      <section className="section section-light">
        <div className="container feature-grid">
          {[
            ["Drawing Review", "Share profile drawings, module format, finish, and required tolerances for feasibility review."],
            ["Sample Confirmation", "Sampling can be arranged before mass production for custom tooling projects."],
            ["Batch Production", "After confirmation, orders are scheduled through automated or custom production lines."]
          ].map(([title, body]) => (
            <div className="feature-card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
