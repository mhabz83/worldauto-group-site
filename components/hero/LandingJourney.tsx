"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { companies, footer, nav } from "@/content/site";
import { NeonJourney } from "./NeonJourney";
import { journeyContent, stopAccents } from "./journeyContent";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION = {
  stopHeight: "118svh",
  revealScrub: 1.15,
  exitScrub: 0.9,
} as const;

const revealFrom = {
  hero: { yPercent: 8, opacity: 0 },
  intro: { xPercent: -12, opacity: 0 },
  company: { yPercent: 16, scale: 0.96, opacity: 0 },
  model: { xPercent: 10, opacity: 0 },
  numbers: { scale: 0.9, opacity: 0 },
  heritage: { xPercent: -10, opacity: 0 },
  partner: { yPercent: 18, opacity: 0 },
} as const;

type StopProps = {
  id?: string;
  kind: keyof typeof revealFrom;
  accent: string;
  align?: "start" | "end";
  children: React.ReactNode;
  label: string;
};

function Stop({ id, kind, accent, align = "start", children, label }: StopProps) {
  return (
    <section
      id={id}
      data-journey-stop
      data-stop-kind={kind}
      className={`journey-stop journey-stop--${align}`}
      style={{ minHeight: MOTION.stopHeight, "--stop-accent": accent } as React.CSSProperties}
      aria-label={label}
    >
      <div className="journey-panel">{children}</div>
    </section>
  );
}

function Header() {
  return (
    <header className="journey-header">
      <Link href="/" className="journey-wordmark" aria-label="WORLDAUTO GROUP home">
        <strong>{nav.wordmark.strong}</strong><span>{nav.wordmark.thin}</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/about">The Group</Link>
        <Link href="/companies">Companies</Link>
        <a href="#model">The Model</a>
        <a href="#heritage">Heritage</a>
      </nav>
      <Link href={nav.cta.href} className="journey-header-cta">{nav.cta.label}</Link>
    </header>
  );
}

function CompanyStop({ company, index }: { company: (typeof companies)[number]; index: number }) {
  const accent = stopAccents[company.slug as keyof typeof stopAccents] ?? stopAccents.hero;
  return (
    <Stop
      kind="company"
      accent={accent}
      align={index % 2 === 0 ? "end" : "start"}
      label={company.name}
    >
      <p className="journey-region">{company.region}</p>
      <h2>{company.name}</h2>
      <p className="journey-company-line">{company.oneLiner}</p>
      <p className="journey-proof">{company.proof}</p>
      <ul className="journey-capabilities" aria-label={`${company.name} capabilities`}>
        {company.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
      </ul>
      <div className="journey-links">
        <Link href={`/companies/${company.slug}`}>Explore {company.name} →</Link>
        <a href={company.url} target="_blank" rel="noreferrer">Visit site</a>
      </div>
    </Stop>
  );
}

export function LandingJourney() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stops = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-journey-stop]"));
    const still = root.querySelector<HTMLElement>(".journey-static-frame");

    // Begin on the exact approved artwork, then hand off to the live camera.
    if (still && stops[0]) {
      gsap.to(still, {
        opacity: 0,
        scale: 1.09,
        xPercent: -2.5,
        ease: "expo.in",
        scrollTrigger: {
          trigger: stops[0],
          start: "top top",
          end: "bottom 44%",
          scrub: 0.8,
        },
      });
    }

    stops.forEach((stop, index) => {
      const panel = stop.querySelector<HTMLElement>(".journey-panel");
      if (!panel) return;
      const kind = stop.dataset.stopKind as keyof typeof revealFrom;
      if (index === 0) {
        gsap.fromTo(panel, revealFrom.hero, { yPercent: 0, opacity: 1, duration: 1.15, ease: "expo.out" });
      } else {
        gsap.fromTo(panel, revealFrom[kind], {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: stop,
            start: "top 82%",
            end: "top 36%",
            scrub: MOTION.revealScrub,
          },
        });
      }

      if (index < stops.length - 1) {
        gsap.fromTo(
          panel,
          { yPercent: 0, opacity: 1 },
          {
            yPercent: kind === "numbers" ? -4 : -10,
            opacity: 0,
            ease: "quart.in",
            immediateRender: false,
            scrollTrigger: {
              trigger: stop,
              start: "bottom 48%",
              end: "bottom 12%",
              scrub: MOTION.exitScrub,
            },
          },
        );
      }
    });
  }, { scope: rootRef });

  return (
    <main ref={rootRef} id="main" className="landing-journey">
      <div className="journey-static-frame" aria-hidden="true">
        <Image
          className="journey-static-image"
          src="/hero/suv-neon.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <NeonJourney />
      <Header />

      <div className="journey-copy-layer">
        <Stop kind="hero" accent={stopAccents.hero} label="World Automotive Group">
          <p className="journey-eyebrow">{journeyContent.hero.eyebrow}</p>
          <h1>{journeyContent.hero.title}</h1>
          <p className="journey-body">{journeyContent.hero.body}</p>
        </Stop>

        <Stop id="companies" kind="intro" accent={stopAccents.companies} align="end" label="Companies">
          <h2>{journeyContent.companiesIntro.title}</h2>
        </Stop>

        {companies.map((company, index) => <CompanyStop key={company.slug} company={company} index={index} />)}

        <Stop id="model" kind="model" accent={stopAccents.model} align="end" label="The Model">
          <h2>{journeyContent.model.title}</h2>
          <p className="journey-statement">{journeyContent.model.statement}</p>
          <div className="journey-pillars">
            {journeyContent.model.pillars.map((pillar) => (
              <article key={pillar.number}>
                <p>{pillar.number}</p><h3>{pillar.title}</h3><p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </Stop>

        <Stop kind="numbers" accent={stopAccents.numbers} label="The Group In Numbers">
          <h2>{journeyContent.numbers.title}</h2>
          <dl className="journey-stats">
            {journeyContent.numbers.stats.map((stat) => (
              <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>
            ))}
          </dl>
        </Stop>

        <Stop id="heritage" kind="heritage" accent={stopAccents.heritage} align="end" label="Heritage">
          <h2>{journeyContent.heritage.title}</h2>
          <p className="journey-statement">{journeyContent.heritage.statement}</p>
          <ol className="journey-timeline">
            {journeyContent.heritage.timeline.map((item) => (
              <li key={item.year}><p>{item.year}</p><div><h3>{item.title}</h3><p>{item.detail}</p></div></li>
            ))}
          </ol>
        </Stop>

        <Stop kind="partner" accent={stopAccents.partner} label="Partner With Us">
          <h2>{journeyContent.partner.title}</h2>
          <p className="journey-body">{journeyContent.partner.body}</p>
          <Link href="/contact" className="journey-primary-cta">{journeyContent.partner.cta}</Link>
          <footer className="journey-footer">
            <p>{companies.map((company) => company.name).join(" · ")}</p>
            <p>{footer.parentLine} · © 2026</p>
          </footer>
        </Stop>
      </div>

      <style jsx global>{`
        html { scroll-behavior: auto; }
        .landing-journey { position: relative; min-height: 100dvh; overflow: clip; background: #000835; color: var(--text-hi); }
        .journey-static-frame { position: fixed; z-index: 2; inset: 0; pointer-events: none; transform-origin: 72% 52%; will-change: transform,opacity; }
        .journey-static-image { object-fit: cover; object-position: center; }
        .journey-webgl { z-index: 1; }
        .journey-copy-layer { position: relative; z-index: 3; }
        .journey-header { position: fixed; z-index: 5; inset: 0 0 auto; height: 72px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: clamp(1rem,3vw,3rem); padding: 0 var(--gutter); background: linear-gradient(180deg,rgba(0,8,53,.96),rgba(0,8,53,.58) 70%,transparent); }
        .journey-wordmark { display: flex; gap: .45rem; color: #fff; text-decoration: none; letter-spacing: -.025em; white-space: nowrap; }
        .journey-wordmark strong { font-weight: 700; }.journey-wordmark span { font-weight: 300; color: var(--text-mid); }
        .journey-header nav { display: flex; justify-content: center; gap: clamp(1rem,2.4vw,2.5rem); }
        .journey-header nav a,.journey-header-cta { color: var(--text-mid); text-decoration: none; font-size: .78rem; white-space: nowrap; }
        .journey-header nav a:hover,.journey-header nav a:focus-visible { color: #fff; }
        .journey-header-cta,.journey-primary-cta { display: inline-flex; width: fit-content; align-items: center; justify-content: center; min-height: 42px; padding: .72rem 1.05rem; background: var(--highlight); color: #fff; text-decoration: none; font-weight: 600; border-radius: 4px; transition: background var(--dur-fast) ease; }
        .journey-header-cta:hover,.journey-primary-cta:hover { background: var(--highlight-hover); }
        .journey-stop { --stop-accent: #1367fe; position: relative; display: flex; align-items: center; padding: 6rem var(--gutter); }
        .journey-stop--end { justify-content: flex-end; }
        .journey-panel { width: min(43rem,48vw); padding: clamp(1.4rem,3vw,2.8rem); background: linear-gradient(105deg,rgba(0,5,31,.96),rgba(0,8,53,.78) 72%,transparent); will-change: transform,opacity; }
        .journey-stop--end .journey-panel { background: linear-gradient(255deg,rgba(0,5,31,.96),rgba(0,8,53,.78) 72%,transparent); }
        .journey-panel h1,.journey-panel h2 { max-width: 12ch; margin: 0; color: #fff; font-size: clamp(2.65rem,6.4vw,6rem); font-weight: 300; letter-spacing: -.04em; line-height: .94; text-wrap: balance; overflow-wrap: anywhere; }
        .journey-panel h2 { font-size: clamp(2.35rem,5vw,4.5rem); }
        .journey-panel h3 { color: #fff; font-size: clamp(1.05rem,1.5vw,1.28rem); font-weight: 500; line-height: 1.2; }
        .journey-eyebrow,.journey-region { margin: 0 0 1.2rem; color: var(--stop-accent); font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
        .journey-body,.journey-company-line,.journey-statement { max-width: 46ch; margin: 1.35rem 0 0; color: rgba(255,255,255,.88); font-size: clamp(1rem,1.3vw,1.18rem); line-height: 1.62; }
        .journey-proof { margin: 1.5rem 0 0; color: #fff; font-size: clamp(1.4rem,2.7vw,2.45rem); font-weight: 300; letter-spacing: -.025em; line-height: 1.08; }
        .journey-capabilities { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.35rem 0 0; padding: 0; list-style: none; }
        .journey-capabilities li { padding: .42rem .68rem; border: 1px solid color-mix(in srgb,var(--stop-accent) 52%,transparent); color: rgba(255,255,255,.9); font-size: .74rem; background: rgba(0,8,53,.7); }
        .journey-links { display: flex; align-items: center; gap: 1.4rem; margin-top: 1.5rem; }
        .journey-links a { color: #fff; text-underline-offset: .35em; text-decoration-color: var(--stop-accent); font-weight: 600; }
        .journey-links a:last-child { color: var(--text-mid); font-size: .82rem; font-weight: 400; }
        .journey-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem 1.7rem; margin-top: 2rem; }
        .journey-pillars article { padding-top: 1rem; border-top: 1px solid color-mix(in srgb,var(--stop-accent) 38%,transparent); }
        .journey-pillars article>p:first-child { margin: 0 0 .4rem; color: var(--stop-accent); font-size: .72rem; }
        .journey-pillars article>p:last-child { margin: .45rem 0 0; color: rgba(255,255,255,.84); font-size: .9rem; line-height: 1.5; }
        .journey-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0 0; }
        .journey-stats div { display: flex; flex-direction: column-reverse; padding-top: 1rem; border-top: 1px solid color-mix(in srgb,var(--stop-accent) 38%,transparent); }
        .journey-stats dt { color: var(--text-mid); font-size: .82rem; }.journey-stats dd { margin: 0 0 .35rem; color: #fff; font-size: clamp(1.75rem,3.5vw,3.2rem); font-weight: 300; letter-spacing: -.03em; }
        .journey-timeline { margin: 1.8rem 0 0; padding: 0; list-style: none; }
        .journey-timeline li { display: grid; grid-template-columns: 5.4rem 1fr; gap: 1rem; padding: .85rem 0; border-top: 1px solid rgba(255,255,255,.13); }
        .journey-timeline li>p { margin: 0; color: var(--stop-accent); font-size: .75rem; }.journey-timeline h3,.journey-timeline li div p { margin: 0; }.journey-timeline li div p { color: rgba(255,255,255,.82); font-size: .88rem; line-height: 1.45; }
        .journey-primary-cta { margin-top: 1.7rem; }.journey-footer { display: flex; justify-content: space-between; gap: 1.5rem; margin-top: 4rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,.13); color: var(--text-mid); font-size: .7rem; }
        .journey-footer p { margin: 0; }
        @media (max-width: 900px) {
          .journey-header { height: 64px; grid-template-columns: 1fr auto; }.journey-header nav { display: none; }.journey-wordmark { font-size: .82rem; }.journey-header-cta { min-height: 38px; padding: .55rem .72rem; font-size: .7rem; }
          .journey-static-image { object-position: 65% center; }.journey-stop,.journey-stop--end { align-items: flex-end; justify-content: stretch; padding: 5rem 0 0; }
          .journey-stop:first-child { min-height: 100svh !important; }
          .journey-panel,.journey-stop--end .journey-panel { width: 100%; padding: 5.5rem var(--gutter) max(1.5rem,env(safe-area-inset-bottom)); background: linear-gradient(0deg,rgba(0,5,31,.98),rgba(0,8,53,.84) 62%,transparent); }
          .journey-panel h1,.journey-panel h2 { font-size: clamp(2.45rem,12vw,4.6rem); }.journey-pillars,.journey-stats { grid-template-columns: 1fr; gap: .85rem; }.journey-pillars article>p:last-child { display: none; }.journey-footer { flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-webgl { display: none !important; }.journey-static-image { display: block; }
          .journey-static-frame { opacity: 1 !important; transform: none !important; }
          .journey-stop { min-height: auto !important; padding-block: clamp(5rem,12vw,8rem); }.journey-panel { will-change: auto; opacity: 1 !important; transform: none !important; }
        }
        html.webgl-unavailable .journey-webgl { display: none !important; }
        html.webgl-unavailable .journey-static-frame { opacity: 1 !important; transform: none !important; }
      `}</style>
    </main>
  );
}
