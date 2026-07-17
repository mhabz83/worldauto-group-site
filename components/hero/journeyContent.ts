export const journeyContent = {
  hero: {
    eyebrow: "World Automotive Group · Abu Dhabi, Est. 1994",
    title: "We Build And Run Automotive.",
    body:
      "Five operating companies across the UAE and North America. One group standard for service, data and retail. Part of Skelmore since 1994.",
  },
  companiesIntro: {
    title: "Five companies, one standard.",
  },
  model: {
    title: "The Model",
    statement: "We build and run automotive operations, then productize what works.",
    pillars: [
      {
        cue: "Deploy",
        title: "Quick Service, Plug and Play",
        body:
          "A standardized quick-service network, ready to deploy: site formats, equipment kits, an operating stack, a technician academy and parts supply.",
      },
      {
        cue: "Understand",
        title: "Data & Software",
        body: "Vehicle valuations, inspections and history intelligence, built to bank standards.",
      },
      {
        cue: "Orchestrate",
        title: "Automotive FinTech",
        body:
          "Financial infrastructure around the vehicle: claims administration and insurer-grade workflows.",
      },
      {
        cue: "Transfer",
        title: "Consulting & Training",
        body:
          "Operator know-how, transferred. Advisory and technician training for automotive networks.",
      },
    ],
  },
  numbers: {
    title: "The Group In Numbers",
    stats: [
      { value: "1994", label: "Founded, Abu Dhabi" },
      { value: "~USD 650M", label: "Annual group revenue" },
      { value: "~4,000", label: "People across the group" },
      { value: "UAE · NA", label: "Two operating regions" },
    ],
  },
  heritage: {
    title: "Heritage",
    statement: "Three decades of operating.",
    timeline: [
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
        detail:
          "Quick service, vehicle data, claims administration and retail, run as one group.",
      },
    ],
  },
  partner: {
    title: "Build With The Group.",
    body:
      "From forecourt networks to vehicle data, we build and run automotive operations at national scale. Talk to the group office in Abu Dhabi.",
    cta: "Partner With Us",
  },
} as const;

export const stopAccents = {
  hero: "#1367FE",
  companies: "#1367FE",
  fasttrack: "#1367FE",
  autodata: "#42D7FF",
  axxion: "#FF4200",
  "pag-direct": "#8A6CFF",
  vicimus: "#34E39B",
  model: "#1367FE",
  numbers: "#FF4200",
  heritage: "#42D7FF",
  partner: "#1367FE",
} as const;
