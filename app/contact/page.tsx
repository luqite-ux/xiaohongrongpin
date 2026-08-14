import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send an inquiry for solar aluminum frames or custom aluminum profiles."
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">Contact</p>
          <h1>Send your solar aluminum frame inquiry</h1>
          <p className="hero-lead">Share drawings, dimensions, order quantity, surface finish, and target schedule. The team will review your project requirements.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container page-grid">
          <div className="contact-card">
            <h3>{siteConfig.company}</h3>
            <p><strong>Phone:</strong> {siteConfig.phone}</p>
            <p><strong>Email:</strong> {siteConfig.email}</p>
            <p><strong>Address:</strong> {siteConfig.address}</p>
            <p>For custom projects, include drawings and the target module or profile application in your message.</p>
          </div>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
