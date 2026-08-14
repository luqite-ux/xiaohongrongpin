export type Locale = "en";

export type LocalizedString = Record<Locale, string>;

export type Product = {
  slug: string;
  category: string;
  name: LocalizedString;
  summary: LocalizedString;
  specs: string[];
  applications: string[];
  highlights: string[];
};

export const siteConfig = {
  locale: "en" as Locale,
  supportedLocales: ["en"] as Locale[],
  brand: "XiaoHongRongPin",
  company: "Hangzhou Xiaohongrongpin Aluminum Industry Co., Ltd.",
  chineseDisplayName: "杭州萧宏荣品铝业有限公司",
  phone: "13805786675",
  email: "1514070298@qq.com",
  address: "No. 2 Extrusion Workshop, Houshan Industrial Park, Qiantan Town, Jiande, Hangzhou, Zhejiang, China",
  tagline: "Precision solar aluminum frames for module manufacturers",
  description:
    "A B2B manufacturer focused on solar aluminum frames and aluminum component solutions for photovoltaic module production."
};

export const capabilityStats = [
  { value: "2016", label: "Company established" },
  { value: "10", label: "Automated production lines" },
  { value: "2", label: "Custom production lines" },
  { value: "600K", label: "Monthly frame capacity" },
  { value: "23M+", label: "Annual solar frame output" },
  { value: "10-15", label: "Typical production days" }
];

export const products: Product[] = [
  {
    slug: "high-performance-solar-frame-set",
    category: "Solar Aluminum Frames",
    name: { en: "High-Performance Long & Short Side Solar Frame Set" },
    summary: {
      en: "Matched long-side and short-side aluminum frame profiles for photovoltaic module assembly, available for mainstream module formats and project-specific tooling."
    },
    specs: ["2384*33*28-6.1 AA10", "1303*33*16-6.1 AA10", "2382*30*28-6.1 AA10", "1134*30*11.5-6.1 AA10"],
    applications: ["Solar PV modules", "Utility-scale module production", "Distributed photovoltaic projects"],
    highlights: ["Mainstream module formats", "Drawing-based tooling", "Stable batch production", "Profile matching for long and short sides"]
  },
  {
    slug: "standard-solar-aluminum-frame",
    category: "Solar Aluminum Frames",
    name: { en: "Standard Solar Aluminum Frame" },
    summary: {
      en: "Bright anodized aluminum frames for solar panel manufacturing, designed for repeatable assembly, clean edges, and scalable procurement."
    },
    specs: ["2384*35*35mm >=10um", "1092*35*16mm >=10um", "2384*35*30mm >=10um", "1092*35*16mm >=10um"],
    applications: ["PV panel perimeter frames", "Solar component manufacturing", "OEM module supply chains"],
    highlights: ["Anodized finish options", "Standard and custom dimensions", "Batch-ready packaging", "Technical data available on request"]
  },
  {
    slug: "black-solar-aluminum-frame",
    category: "Black Aluminum Frames",
    name: { en: "Black Solar Aluminum Frame" },
    summary: {
      en: "Black AA15 aluminum frame options for solar modules where a refined exterior appearance and consistent finishing are required."
    },
    specs: ["1762*30*30-5.2 black AA15", "1134*30*30-5.2 black AA15", "1762*30*30-5.0 black AA15", "1134*30*30-5.0 black AA15"],
    applications: ["Residential solar modules", "Commercial rooftop PV", "Appearance-focused module programs"],
    highlights: ["Black surface finish", "Multiple profile depths", "Project-specific frame matching", "Inspection before shipment"]
  },
  {
    slug: "special-shaped-aluminum-profile",
    category: "Custom Aluminum Profiles",
    name: { en: "Special-Shaped Aluminum Profile" },
    summary: {
      en: "Custom-shaped aluminum profiles produced from buyer drawings for photovoltaic accessories and industrial aluminum component projects."
    },
    specs: ["163.5*59.3*35.5", "106.7*26*56*111.4", "57.2*50*78.1", "Tooling can be opened according to customer drawings"],
    applications: ["Solar module accessories", "Industrial aluminum assemblies", "Drawing-based OEM parts"],
    highlights: ["Custom tooling support", "Profile engineering review", "Small-batch sampling before mass production", "Production progress feedback"]
  }
];

export const faqs = [
  {
    question: "What specifications or models are available?",
    answer: "Mainstream solar frame formats are available, and tooling can be opened according to customer drawings."
  },
  {
    question: "Do you support customized size, material, color, or process?",
    answer: "Yes. Size, material, color, surface treatment, and processing details can be customized for B2B projects."
  },
  {
    question: "Can you provide samples?",
    answer: "Samples can be arranged. For new tooling projects, sample timing and tooling details are confirmed after drawing review."
  },
  {
    question: "What industries or applications are your products suitable for?",
    answer: "The main application is solar photovoltaic modules, especially aluminum frames and aluminum accessories for PV panel production."
  },
  {
    question: "Do you support OEM or ODM services?",
    answer: "Yes. OEM and ODM cooperation is supported for drawing-based aluminum frame and profile projects."
  },
  {
    question: "What is the minimum order quantity?",
    answer: "The reference MOQ is 10,000 sets. Final MOQ depends on profile, tooling, finish, and packaging requirements."
  },
  {
    question: "What is the production lead time after ordering?",
    answer: "New tooling orders are usually around 15 days after confirmation. Repeat products are usually around 10 days, subject to production scheduling."
  },
  {
    question: "Do you support third-party inspection?",
    answer: "Yes. Third-party inspection and shipment-ready inspection records can be coordinated according to buyer requirements."
  }
];

export function text(value: LocalizedString, locale: Locale = "en") {
  return value[locale] || value.en || Object.values(value)[0] || "";
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
