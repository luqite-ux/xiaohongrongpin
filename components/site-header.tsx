import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

const nav = [
  ["Home", "/"],
  ["Products", "/products"],
  ["Capabilities", "/capabilities"],
  ["Custom Solutions", "/custom-solutions"],
  ["Quality Control", "/quality-control"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="XiaoHongRongPin home">
        <Image src="/logo.png" alt="XiaoHongRongPin logo" width={88} height={68} priority />
        <span>
          <strong>{siteConfig.brand}</strong>
          <small>Solar Aluminum Frames</small>
        </span>
      </Link>
      <nav aria-label="Primary navigation">
        {nav.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <Link href="/contact" className="header-cta">
        Request Quote <ArrowUpRight size={16} />
      </Link>
    </header>
  );
}
