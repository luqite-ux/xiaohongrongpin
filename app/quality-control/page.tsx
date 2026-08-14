import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quality Control",
  description: "Inspection workflow for solar aluminum frame and custom aluminum profile production."
};

export default function QualityControlPage() {
  const steps = ["Incoming material review", "Profile dimension check", "Cutting and punching process control", "Surface and appearance inspection", "Packaging and shipment-ready records", "Third-party inspection coordination"];
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">Quality Control</p>
          <h1>Inspection checkpoints for B2B frame procurement</h1>
          <p className="hero-lead">The site presents a practical inspection workflow focused on dimensions, surface finish, records, and buyer coordination.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container feature-grid">
          {steps.map((step, index) => (
            <div className="feature-card" key={step}>
              <p className="eyebrow">Step {String(index + 1).padStart(2, "0")}</p>
              <h3>{step}</h3>
              <p>Each checkpoint supports clearer communication before shipment and helps buyers align requirements with production records.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
