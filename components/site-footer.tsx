import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

export function SiteFooter() {
  const legalName = "Hangzhou Xiaohongrongpin Aluminum Industry Co., Ltd.".replace(/[.\s]+$/, "");
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" aria-label="XiaoHongRongPin home">
            <Image src="/logo.png" alt="XiaoHongRongPin logo" width={132} height={102} className="max-w-full object-contain" style={{ height: "auto" }} />
          </Link>
          <h3>{siteConfig.company}</h3>
          <p>{siteConfig.description}</p>
        </div>
        <div>
          <h4>Pages</h4>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/custom-solutions">Custom Solutions</Link>
          <Link href="/quality-control">Quality Control</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p><Phone size={16} /> {siteConfig.phone}</p>
          <p><Mail size={16} /> {siteConfig.email}</p>
          <p><MapPin size={16} /> {siteConfig.address}</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {legalName}. All rights reserved.</div>
    </footer>
  );
}
