import Link from "next/link";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";

const companies = [
  ["FastTrack", "fasttrack", "Quick vehicle service on UAE fuel forecourts, in partnership with Emarat since 2004."],
  ["AutoData", "autodata", "Bank-grade vehicle valuations, inspections and vehicle history intelligence."],
  ["Axxion", "axxion", "The UAE's first motor-claims third-party administrator, routing insurer-contracted repair work to approved workshops."],
  ["PAG Direct", "pag-direct", "The group's automotive retail arm in Canada: new and used vehicle sales and service, digital and in-person."],
  ["Vicimus", "vicimus", "The group's automotive software engine, mining dealership customer and service data to drive retention and lifecycle."],
];

const pillars = [
  ["01", "Quick Service, Plug and Play", "A standardized quick-service network, ready to deploy: site formats, equipment kits, an operating stack, a technician academy and parts supply."],
  ["02", "Data & Software", "Vehicle valuations, inspections and history intelligence, built to bank standards."],
  ["03", "Automotive FinTech", "Financial infrastructure around the vehicle: claims administration and insurer-grade workflows."],
  ["04", "Consulting & Training", "Operator know-how, transferred. Advisory and technician training for automotive networks."],
];

const stats = [
  ["1994", "Founded, Abu Dhabi"],
  ["~USD 650M", "Annual group revenue"],
  ["~4,000", "People across the group"],
  ["UAE · NA", "Two operating regions"],
];

const heritage = [
  ["1990s", "Phaeton Auto Group opens in Ontario", "The retail roots of what is now PAG Direct, more than 30 years on."],
  ["1994", "Skelmore is founded in Abu Dhabi", "The parent group that World Automotive Group grew from."],
  ["2004", "FastTrack launches with Emarat", "Quick vehicle service arrives on UAE fuel forecourts."],
  ["Today", "32 centres, two continents", "Quick service, vehicle data, claims administration and retail, run as one group."],
];

function Scrim() {
  // keeps text legible over the moving neon scene
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1]"
      style={{ background: "linear-gradient(90deg, rgba(2,4,15,0.92) 0%, rgba(2,4,15,0.6) 42%, rgba(2,4,15,0.28) 72%, rgba(2,4,15,0.4) 100%)" }}
    />
  );
}

export default function Home() {
  return (
    <>
      <HeroBackdrop />

      <div className="relative z-10">
        {/* fixed chrome */}
        <header className="header-fade fixed inset-x-0 top-0 z-20 flex items-center justify-between px-[var(--gutter)] py-6">
          <span className="text-lg uppercase tracking-[0.28em] text-hi">
            <span className="font-medium">WorldAuto</span>{" "}
            <span className="text-mid">Group</span>
          </span>
          <nav className="hidden gap-10 md:flex">
            {[["The Group", "/about"], ["Companies", "#companies"], ["The Model", "#model"], ["Heritage", "#heritage"]].map(([l, h]) => (
              <a key={h} href={h} className="type-kicker link-sweep text-mid hover:text-hi">{l}</a>
            ))}
          </nav>
          <Link href="/contact" className="rounded-[4px] bg-highlight px-5 py-3 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]">
            Partner With Us
          </Link>
        </header>

        <main id="main">
          {/* HERO — road */}
          <section className="relative flex min-h-screen flex-col justify-center px-[var(--gutter)]">
            <Scrim />
            <div data-parallax="5" className="relative max-w-4xl">
              <p data-reveal className="type-kicker text-mid">World Automotive Group · Abu Dhabi · Est. 1994</p>
              <h1 data-reveal className="mt-8 font-light leading-[0.9] text-hi" style={{ fontSize: "var(--fs-display)" }}>
                We Build<br />And Run<br /><span className="text-highlight">Automotive.</span>
              </h1>
              <p data-reveal className="mt-10 max-w-md text-lg leading-relaxed text-mid">
                Five operating companies across the UAE and North America. One group standard for
                service, data and retail. Part of Skelmore since 1994.
              </p>
            </div>
          </section>

          {/* COMPANIES — skyline */}
          <section id="companies" className="relative flex min-h-screen flex-col justify-center px-[var(--gutter)] py-24">
            <Scrim />
            <div className="relative">
              <p data-reveal className="type-kicker text-accent">01 — The Companies</p>
              <h2 data-reveal className="mt-6 max-w-4xl font-light leading-[1.02] text-hi" style={{ fontSize: "var(--fs-h1)" }}>
                Five companies, one standard.
              </h2>
              <div className="mt-14 grid gap-px border-y border-hairline sm:grid-cols-2 lg:grid-cols-3">
                {companies.map(([name, slug, line], i) => (
                  <Link data-reveal key={name} href={`/companies/${slug}`} className="group py-8 pr-8 transition-opacity hover:opacity-100 sm:pr-10">
                    <p className="type-kicker text-highlight">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-lg font-medium text-hi">{name}</h3>
                    <p className="mt-2 text-mid">{line}</p>
                    <span className="mt-4 inline-block type-kicker text-mid transition-colors group-hover:text-highlight">Explore →</span>
                  </Link>
                ))}
              </div>
              <Link href="/companies" className="mt-10 inline-block type-kicker link-sweep text-mid hover:text-hi">
                View all companies →
              </Link>
            </div>
          </section>

          {/* MODEL — network */}
          <section id="model" className="relative flex min-h-screen flex-col justify-center px-[var(--gutter)] py-24">
            <Scrim />
            <div className="relative">
              <p data-reveal className="type-kicker text-accent">02 — The Model</p>
              <h2 data-reveal className="mt-6 max-w-3xl font-light leading-[1.02] text-hi" style={{ fontSize: "var(--fs-h1)" }}>
                We build and run automotive operations, then productize what works.
              </h2>
              <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
                {pillars.map(([num, name, body]) => (
                  <div data-reveal key={num} className="max-w-md border-t border-hairline pt-6">
                    <p className="type-kicker text-highlight">{num}</p>
                    <h3 className="mt-3 text-xl font-medium text-hi">{name}</h3>
                    <p className="mt-2 text-mid">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* NUMBERS */}
          <section className="relative flex min-h-screen flex-col justify-center px-[var(--gutter)] py-24">
            <Scrim />
            <div className="relative">
              <p data-reveal className="type-kicker text-accent">03 — The Group In Numbers</p>
              <div className="mt-12 grid gap-px border-y border-hairline sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(([v, l]) => (
                  <div data-reveal key={l} className="py-10 pr-8">
                    <p className="font-light text-hi" style={{ fontSize: "var(--fs-h2)" }}>{v}</p>
                    <p className="mt-3 type-kicker text-mid">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HERITAGE — flow */}
          <section id="heritage" className="relative flex min-h-screen flex-col justify-center px-[var(--gutter)] py-24">
            <Scrim />
            <div className="relative">
              <p data-reveal className="type-kicker text-accent">04 — Heritage</p>
              <h2 data-reveal className="mt-6 max-w-3xl font-light leading-[1.02] text-hi" style={{ fontSize: "var(--fs-h1)" }}>
                Three decades of operating.
              </h2>
              <div className="mt-14 max-w-3xl">
                {heritage.map(([year, title, detail]) => (
                  <div data-reveal key={year} className="grid grid-cols-[7rem_1fr] gap-6 border-t border-hairline py-6">
                    <p className="type-kicker text-highlight">{year}</p>
                    <div>
                      <h3 className="text-lg font-medium text-hi">{title}</h3>
                      <p className="mt-1 text-mid">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT / FOOTER */}
          <section id="partner" className="relative flex min-h-screen flex-col justify-center px-[var(--gutter)] py-24">
            <Scrim />
            <div className="relative max-w-3xl">
              <p data-reveal className="type-kicker text-accent">05 — Partner</p>
              <h2 data-reveal className="mt-6 font-light leading-[0.95] text-hi" style={{ fontSize: "var(--fs-display)" }}>
                Build With <span className="text-highlight">The Group.</span>
              </h2>
              <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-mid">
                From forecourt networks to vehicle data, we build and run automotive operations at
                national scale. Talk to the group office in Abu Dhabi.
              </p>
              <Link href="/contact" className="mt-10 inline-flex rounded-[4px] bg-highlight px-7 py-4 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]">
                Partner With Us
              </Link>
              <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8">
                <p className="type-kicker text-faint">FastTrack · AutoData · Axxion · PAG Direct · Vicimus</p>
                <p className="type-kicker text-faint">A Skelmore company · © 2026</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
