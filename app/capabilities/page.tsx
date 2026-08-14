import type { Metadata } from "next";
import { capabilityStats } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Manufacturing Capabilities",
  description: "Automated production capacity for solar aluminum frame and custom profile projects."
};

export default function CapabilitiesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">Capabilities</p>
          <h1>Automated capacity for solar aluminum frame supply</h1>
          <p className="hero-lead">The company operates automated and customized production lines for photovoltaic aluminum frame projects.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container stats-grid">
          {capabilityStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section section-white">
        <div className="container feature-grid">
          {["Automated cutting and frame processing", "Custom line planning for drawing-based profiles", "Production feedback during order execution"].map((item) => (
            <div className="feature-card" key={item}>
              <h3>{item}</h3>
              <p>Capacity, timing, and technical requirements are reviewed according to project scope and current production scheduling.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
