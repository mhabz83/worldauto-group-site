/**
 * Group-level facts and site chrome copy.
 * Every claim on the site must trace back to this content layer.
 * Anything unverified is marked in PLACEHOLDERS.md — never invented here.
 */

export const siteMeta = {
  titleDefault: "World Automotive Group",
  titleSuffix: "World Automotive Group",
  description:
    "World Automotive Group is the automotive arm of Skelmore. Five operating companies across the UAE and North America: FastTrack, AutoData, Axxion, PAG Direct and Vicimus.",
  url: "https://worldauto.group",
} as const;

export const group = {
  name: "World Automotive Group",
  shortName: "WAG",
  parent: {
    name: "Skelmore",
    url: "https://skelmore.com",
    founded: 1994,
  },
  hq: "Suite 203, Floor 11, Al Sarab Tower, ADGM, Abu Dhabi",
  footprint: "UAE · North America",
  est: "EST. 1994 · ABU DHABI",
} as const;

export type Company = {
  slug: string;
  name: string;
  oneLiner: string;
  chipHint: string;
  proof: string;
  region: string;
  capabilities: string[];
  url: string;
  urlLabel: string;
};

export const companies: Company[] = [
  {
    slug: "fasttrack",
    name: "FastTrack",
    oneLiner:
      "Quick vehicle service on UAE fuel forecourts, in partnership with Emarat since 2004.",
    chipHint: "quick service · 32 centres",
    proof: "32 quick-service centres",
    region: "United Arab Emirates",
    capabilities: [
      "Quick vehicle service",
      "Fuel-forecourt network",
      "Emarat partnership since 2004",
    ],
    url: "https://www.fasttrackemarat.com",
    urlLabel: "fasttrackemarat.com",
  },
  {
    slug: "autodata",
    name: "AutoData",
    oneLiner:
      "Bank-grade vehicle valuations, inspections and vehicle history intelligence.",
    chipHint: "vehicle intelligence",
    // pending owner-verified figure
    proof: "Valuations, Inspections, History",
    region: "United Arab Emirates",
    capabilities: [
      "Vehicle valuations",
      "Inspections",
      "Vehicle history intelligence",
    ],
    url: "https://autodata.me",
    urlLabel: "autodata.me",
  },
  {
    slug: "axxion",
    name: "Axxion",
    oneLiner:
      "The UAE's first motor-claims third-party administrator, routing insurer-contracted repair work to approved workshops.",
    chipHint: "motor-claims TPA",
    proof: "The UAE's first motor-claims TPA",
    region: "United Arab Emirates",
    capabilities: [
      "Motor-claims administration",
      "Insurer-contracted repair routing",
      "Approved-workshop network",
    ],
    url: "https://axxion.com",
    urlLabel: "axxion.com",
  },
  {
    slug: "pag-direct",
    name: "PAG Direct",
    oneLiner:
      "The group's automotive retail arm in Canada: new and used vehicle sales and service, digital and in-person.",
    chipHint: "retail · Ontario, Canada",
    proof: "Two Hyundai dealerships · 30+ years",
    region: "Ontario, Canada",
    capabilities: [
      "New and used vehicle sales",
      "Vehicle service",
      "Digital and in-person retail",
    ],
    url: "https://www.pagdirect.com",
    urlLabel: "pagdirect.com",
  },
  {
    slug: "vicimus",
    name: "Vicimus",
    oneLiner:
      "The group's automotive software engine. It mines a dealership's own customer and service data to surface who is due and who is ready to upgrade, turning one-off visits into lasting relationships.",
    chipHint: "dealer data · retention software",
    // pending owner-verified figure
    proof: "Retention, Intent mining, Lifecycle CRM",
    region: "North America",
    capabilities: [
      "Retention campaigns",
      "Intent mining",
      "Lifecycle CRM",
      "Business intelligence",
      "Call tracking",
    ],
    url: "https://vicimus.com",
    urlLabel: "vicimus.com",
  },
];

export type Leader = {
  name: string;
  title: string;
  bio?: string;
};

/* Group leadership — owner-confirmed 2026-07-13. Bios optional and not yet
   supplied; short public bios can be added later. Owner (Mounir) may be added. */
export const leaders: Leader[] = [
  { name: "Amin Kadrie", title: "Chairman" },
  { name: "Khalid Kadrie", title: "CEO, AutoData & Axxion" },
  { name: "Alexander Maas", title: "Chief Financial Officer" },
  { name: "Raymond Zhu", title: "Chief Technology Officer" },
];

/* The team carousel roster — owner-supplied names, titles and portrait
   status (2026-07-16). `placeholder: true` marks interim AI portraits awaiting
   the final photography (Dreambox originals or approved regenerations). */
export type TeamMember = {
  name: string;
  role: string;
  /* one-line duty statement derived strictly from the role -- replace with
     an approved bio per person when provided */
  desc: string;
  image: string;
  placeholder?: boolean;
};

export const team: TeamMember[] = [
  {
    name: "Amin Kadrie",
    role: "Chairman",
    desc: "Chairs the group and sets its long-term direction.",
    image: "/team/amin.webp",
    placeholder: true,
  },
  {
    name: "Khalid Kadrie",
    role: "CEO, AutoData & Axxion",
    desc: "Leads AutoData and Axxion day to day.",
    image: "/team/khalid.webp",
  },
  {
    name: "Alexander Maas",
    role: "CFO, World Automotive Group",
    desc: "Oversees the group's finances.",
    image: "/team/alex.webp",
    placeholder: true,
  },
  {
    name: "Raymond Zhu",
    role: "CTO, World Automotive Group",
    desc: "Leads technology across the group.",
    image: "/team/raymond.webp",
    placeholder: true,
  },
  {
    name: "Mounir Habib",
    role: "Group SVP",
    desc: "Senior leadership across the group's companies.",
    image: "/team/mounir.webp",
  },
  {
    name: "Frederik Bisbjerg",
    role: "Managing Director & Co-founder, Axxion",
    desc: "Co-founded and leads Axxion.",
    image: "/team/frederik.webp",
    placeholder: true,
  },
  {
    name: "Rita Estephane",
    role: "Executive Director, Strategic Growth, Axxion",
    desc: "Leads strategic growth at Axxion.",
    image: "/team/rita.webp",
  },
  {
    name: "Stijn Venrooij",
    role: "Director, AI & Business Development, Axxion",
    desc: "Leads AI and business development at Axxion.",
    image: "/team/stijn.webp",
    placeholder: true,
  },
  {
    name: "Dalia Kanaan",
    role: "Group HR Business Partner",
    desc: "Partners with the companies on people and HR.",
    image: "/team/dalia.webp",
    placeholder: true,
  },
  {
    name: "Maryam Zandi",
    role: "General Manager, AutoData Insurance",
    desc: "Leads AutoData Insurance day to day.",
    image: "/team/maryam.webp",
    placeholder: true,
  },
];

export const nav = {
  wordmark: { strong: "WORLDAUTO", thin: "GROUP" },
  links: [
    { label: "The Group", href: "/#story" },
    { label: "Companies", href: "/companies" },
    { label: "The Model", href: "/#model" },
    { label: "Heritage", href: "/#heritage" },
    { label: "Team", href: "/#team" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Partner With Us", href: "/contact" },
} as const;

export const footer = {
  blurb:
    "World Automotive Group is the automotive arm of Skelmore, a private group founded in 1994. Operations in the UAE and North America.",
  companiesHeading: "Companies",
  parentHeading: "Group",
  parentLine: "A Skelmore company",
  legal: "© 2026 World Automotive Group. All rights reserved.",
  /* [TO CONFIRM: legal entity name] — see PLACEHOLDERS.md */
} as const;
