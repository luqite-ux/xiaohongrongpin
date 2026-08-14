import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About",
  description: "About Hangzhou Xiaohongrongpin Aluminum Industry Co., Ltd."
};

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">About</p>
          <h1>{siteConfig.company}</h1>
          <p className="hero-lead">
            Established in 2016, the company focuses on solar photovoltaic aluminum frames and aluminum accessories for PV module production.
          </p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container page-grid">
          <div className="page-card">
            <h3>Company Background</h3>
            <p>
              Hangzhou Xiaohongrongpin Aluminum Industry Co., Ltd. is affiliated with Hangzhou Xiaohong Construction Group. The company was established to support the solar frame industrial chain and provide processed aluminum frame products for photovoltaic module manufacturers.
            </p>
          </div>
          <div className="page-card">
            <h3>Production Base</h3>
            <p>
              The production base is located in Jiande, Hangzhou, Zhejiang. It uses modern standardized workshops and automated equipment for solar aluminum frame processing and related aluminum component production.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
