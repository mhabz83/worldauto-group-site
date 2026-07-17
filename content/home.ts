/**
 * Home page copy. Facts only — see PLACEHOLDERS.md for open items.
 * Headline options considered are in content/copy-options.md.
 */

export const hero = {
  microLabel: "WORLD AUTOMOTIVE GROUP · ABU DHABI, EST. 1994",
  /* Option 1 from content/copy-options.md */
  headlineLines: ["automotive, run like", "infrastructure."],
  italicWord: "infrastructure.",
  sub: "Five operating companies across the UAE and North America. One group standard for service, data and retail. Part of Skelmore since 1994.",
  ctaPrimary: { label: "The Companies", href: "#companies" },
  ctaSecondary: { label: "Partner With Us", href: "#partner" },
  image: {
    src: "/images/hero-interchange-night.png",
    alt: "Elevated highway interchange at night with headlight and taillight light trails",
  },
} as const;

export const numbers = {
  kicker: "The group in numbers",
  monoLabel: "01 / SCALE",
  stats: [
    { value: 1994, label: "Founded, Abu Dhabi", format: "year" },
    { value: 650, prefix: "USD ", suffix: "M", label: "Annual group revenue", approx: true },
    { value: 4000, prefix: "~", label: "People across the group", format: "thousands" },
    { value: 2, label: "Regions: UAE + North America" },
  ],
  credit: "Group figures include all Skelmore operations.",
} as const;

export const model = {
  kicker: "The model",
  monoLabel: "02 / OPERATIONS",
  heading: "What the group does",
  intro:
    "We build and run automotive operations, then productize what works.",
  pillars: [
    {
      number: "01",
      name: "Quick Service, Plug and Play",
      flagship: true,
      /* [TO CONFIRM: Quick Service Plug and Play positioning copy from owner] */
      body: "A standardized quick-service network, ready to deploy: site formats, per-bay equipment kits, an operating stack, a technician academy and parts supply. Built to plug into large fuel and retail networks.",
      footnote: "The flagship. Proven on live forecourts since 2004.",
    },
    {
      number: "02",
      name: "Data & Software",
      flagship: false,
      body: "Vehicle valuations, inspections and history intelligence, built to bank standards.",
    },
    {
      number: "03",
      name: "Automotive FinTech",
      flagship: false,
      body: "Financial infrastructure around the vehicle: claims administration and insurer-grade workflows.",
    },
    {
      number: "04",
      name: "Consulting & Training",
      flagship: false,
      body: "Operator know-how, transferred. Advisory and technician training for automotive networks.",
    },
  ],
} as const;

export const companiesSection = {
  kicker: "The companies",
  monoLabel: "03 / OPERATING COMPANIES",
  heading: "Five companies, one standard",
  intro:
    "Operating companies, not investments. Each one built, run and held to the group standard.",
} as const;

export const proofBand = {
  monoLabel: "04 / PROOF",
  editorial: {
    lines: ["proof, measured", "in minutes."],
    italicWord: "minutes.",
  },
  body: "FastTrack has serviced UAE drivers on Emarat forecourts since 2004. The numbers are audited by the people who matter: the customers.",
  stats: [
    { value: 330000, suffix: "+", label: "Customers on record", format: "compact" },
    { value: 4.6, suffix: "/5", label: "Google Reviews average (2025)", format: "decimal" },
    { value: 94, suffix: "%", label: "Independent mystery-shopper score" },
    { value: 22, prefix: "~", suffix: " min", label: "Average visit" },
  ],
  image: {
    src: "/images/forecourt-service-night.png",
    alt: "Fuel forecourt service bays glowing beneath a canopy at night",
  },
} as const;

export const heritage = {
  kicker: "Heritage",
  monoLabel: "05 / SINCE 1994",
  heading: "Three decades of operating",
  rows: [
    {
      year: "1990s",
      title: "Phaeton Auto Group opens in Ontario",
      detail: "The retail roots of what is now PAG Direct, more than 30 years on.",
    },
    {
      year: "1994",
      title: "Skelmore is founded in Abu Dhabi",
      detail: "The parent group that World Automotive Group grew from.",
    },
    {
      year: "2004",
      title: "FastTrack launches with Emarat",
      detail: "Quick vehicle service arrives on UAE fuel forecourts.",
    },
    {
      year: "Today",
      title: "32 centres, two continents",
      detail: "Quick service, vehicle data, claims administration and retail, run as one group.",
    },
  ],
  /* [TO CONFIRM: other public milestones] */
} as const;

export const ctaBand = {
  monoLabel: "06 / PARTNER",
  lines: ["build with the group."],
  body: "From forecourt networks to vehicle data, we build and run automotive operations at national scale. Talk to the group office in Abu Dhabi.",
  cta: { label: "Partner With Us", href: "mailto:" },
  /* [TO CONFIRM: public contact email] — mailto left blank deliberately */
  image: {
    src: "/images/skyline-water-night.png",
    alt: "Waterfront city skyline at night across dark water",
  },
} as const;
