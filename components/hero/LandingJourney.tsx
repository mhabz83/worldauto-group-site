"use client";

import Link from "next/link";
import Image from "next/image";
import { Children, useEffect, useRef, useState } from "react";
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
  navSection: "group" | "companies" | "model" | "heritage" | "partner";
};

function Stop({ id, kind, accent, align = "start", children, label, navSection }: StopProps) {
  return (
    <section
      id={id}
      data-journey-stop
      data-stop-kind={kind}
      data-nav-section={navSection}
      className={`journey-stop journey-stop--${align}`}
      style={{ minHeight: MOTION.stopHeight, "--stop-accent": accent } as React.CSSProperties}
      aria-label={label}
    >
      <div className="journey-panel">{Children.toArray(children)}</div>
    </section>
  );
}

const journeyStops = [
  { id: "group", label: "The Group" },
  { id: "companies", label: "Companies" },
  ...companies.map((company) => ({ id: `company-${company.slug}`, label: company.name })),
  { id: "model", label: "The Model" },
  { id: "numbers", label: "Group Numbers" },
  { id: "heritage", label: "Heritage" },
  { id: "partner", label: "Partner With Us" },
] as const;

const headerLinks = [
  { label: "The Group", href: "#group", section: "group" },
  { label: "Companies", href: "#companies", section: "companies" },
  { label: "The Model", href: "#model", section: "model" },
  { label: "Heritage", href: "#heritage", section: "heritage" },
  { label: "Partner", href: "#partner", section: "partner" },
] as const;

function Header() {
  const [activeSection, setActiveSection] = useState<(typeof headerLinks)[number]["section"]>("group");
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stops = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-stop]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const section = (visible?.target as HTMLElement | undefined)?.dataset.navSection;
        if (section) setActiveSection(section as (typeof headerLinks)[number]["section"]);
      },
      { rootMargin: "-44% 0px -44% 0px", threshold: [0, 0.01, 0.1] },
    );
    stops.forEach((stop) => observer.observe(stop));

    // Progress rail: ScrollTrigger already owns scroll on this page, so it
    // drives the fill too — no parallel window scroll listener. It also
    // re-measures on resize/refresh for free.
    const setFill = (progress: number) => {
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setFill(self.progress),
      onRefresh: (self) => setFill(self.progress),
    });
    setFill(progressTrigger.progress);
    return () => {
      observer.disconnect();
      progressTrigger.kill();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="journey-header">
        <Link href="/" className="journey-wordmark" aria-label="WORLDAUTO GROUP home">
          <strong>{nav.wordmark.strong}</strong><span>{nav.wordmark.thin}</span>
        </Link>
        <nav className="journey-desktop-nav" aria-label="Journey navigation">
          {headerLinks.slice(0, 4).map((link) => (
            <a
              key={link.section}
              href={link.href}
              className={activeSection === link.section ? "is-active" : undefined}
              aria-current={activeSection === link.section ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#partner"
          className={`journey-header-cta${activeSection === "partner" ? " is-active" : ""}`}
          aria-current={activeSection === "partner" ? "location" : undefined}
        >
          {nav.cta.label}
        </a>
        <button
          type="button"
          className="journey-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="journey-mobile-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </header>

      <div className="journey-progress" aria-hidden="true">
        <div ref={progressRef} className="journey-progress-fill" />
        <div className="journey-progress-stops">
          {journeyStops.map((stop) => <span key={stop.id} title={stop.label} />)}
        </div>
      </div>

      <nav
        id="journey-mobile-menu"
        className={`journey-mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile journey navigation"
        aria-hidden={!menuOpen}
      >
        {headerLinks.map((link) => (
          <a
            key={link.section}
            href={link.href}
            className={activeSection === link.section ? "is-active" : undefined}
            aria-current={activeSection === link.section ? "location" : undefined}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            <span>{link.label}</span><span aria-hidden="true">→</span>
          </a>
        ))}
      </nav>
    </>
  );
}

function CompanyStop({ company, index }: { company: (typeof companies)[number]; index: number }) {
  const accent = stopAccents[company.slug as keyof typeof stopAccents] ?? stopAccents.hero;
  return (
    <Stop
      id={`company-${company.slug}`}
      kind="company"
      accent={accent}
      align={index % 2 === 0 ? "end" : "start"}
      label={company.name}
      navSection="companies"
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
        <Stop id="group" kind="hero" accent={stopAccents.hero} label="World Automotive Group" navSection="group">
          <p className="journey-eyebrow">{journeyContent.hero.eyebrow}</p>
          <h1>{journeyContent.hero.title}</h1>
          <p className="journey-body">{journeyContent.hero.body}</p>
        </Stop>

        <Stop id="companies" kind="intro" accent={stopAccents.companies} align="end" label="Companies" navSection="companies">
          <h2>{journeyContent.companiesIntro.title}</h2>
        </Stop>

        {companies.map((company, index) => <CompanyStop key={company.slug} company={company} index={index} />)}

        <Stop id="model" kind="model" accent={stopAccents.model} align="end" label="The Model" navSection="model">
          <h2>{journeyContent.model.title}</h2>
          <p className="journey-statement">{journeyContent.model.statement}</p>
          <div className="journey-pillars">
            {journeyContent.model.pillars.map((pillar) => (
              <article key={pillar.cue}>
                <p>{pillar.cue}</p><h3>{pillar.title}</h3><p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </Stop>

        <Stop id="numbers" kind="numbers" accent={stopAccents.numbers} label="The Group In Numbers" navSection="model">
          <h2>{journeyContent.numbers.title}</h2>
          <dl className="journey-stats">
            {journeyContent.numbers.stats.map((stat) => (
              <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>
            ))}
          </dl>
        </Stop>

        <Stop id="heritage" kind="heritage" accent={stopAccents.heritage} align="end" label="Heritage" navSection="heritage">
          <h2>{journeyContent.heritage.title}</h2>
          <p className="journey-statement">{journeyContent.heritage.statement}</p>
          <ol className="journey-timeline">
            {journeyContent.heritage.timeline.map((item) => (
              <li key={item.year}><p>{item.year}</p><div><h3>{item.title}</h3><p>{item.detail}</p></div></li>
            ))}
          </ol>
        </Stop>

        <Stop id="partner" kind="partner" accent={stopAccents.partner} label="Partner With Us" navSection="partner">
          <h2>{journeyContent.partner.title}</h2>
          <p className="journey-body">{journeyContent.partner.body}</p>
          <Link href="/contact" className="journey-primary-cta">{journeyContent.partner.cta}</Link>
          <a href="#group" className="journey-back-to-top">Back to top <span aria-hidden="true">↑</span></a>
          <footer className="journey-footer">
            <p>{companies.map((company) => company.name).join(" · ")}</p>
            <p>{footer.parentLine} · © 2026</p>
          </footer>
        </Stop>
      </div>

      <style jsx global>{`
        html { scroll-behavior: auto; }
        .landing-journey { position: relative; min-height: 100dvh; overflow: clip; background: #000835; color: var(--text-hi); }
        /* The still is fallback-only. The licensed 3D SUV is the primary
           frame from first paint whenever WebGL and motion are available. */
        .journey-static-frame { position: fixed; z-index: 2; inset: 0; opacity: 0; pointer-events: none; transform-origin: 72% 52%; }
        .journey-static-image { object-fit: cover; object-position: center; }
        .journey-webgl { z-index: 1; }
        .journey-copy-layer { position: relative; z-index: 3; }
        .journey-header { position: fixed; z-index: 8; inset: 0 0 auto; height: 72px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: clamp(1rem,3vw,3rem); padding: 0 var(--gutter); background: linear-gradient(180deg,rgba(0,8,53,.96),rgba(0,8,53,.58) 70%,transparent); }
        .journey-wordmark { display: flex; gap: .45rem; color: #fff; text-decoration: none; letter-spacing: -.025em; white-space: nowrap; }
        .journey-wordmark strong { font-weight: 700; }.journey-wordmark span { font-weight: 300; color: var(--text-mid); }
        .journey-desktop-nav { display: flex; justify-content: center; gap: clamp(1rem,2.4vw,2.5rem); }
        .journey-desktop-nav a,.journey-header-cta { position: relative; display: inline-flex; min-height: 44px; align-items: center; color: var(--text-mid); text-decoration: none; font-size: .78rem; white-space: nowrap; transition: color var(--dur-fast) ease; }
        .journey-desktop-nav a::after { position: absolute; right: 0; bottom: 7px; left: 0; height: 1px; background: currentColor; content: ""; transform: scaleX(0); transform-origin: right; transition: transform var(--dur-fast) var(--ease-reveal); }
        .journey-desktop-nav a:hover,.journey-desktop-nav a:focus-visible,.journey-desktop-nav a.is-active { color: #fff; }
        .journey-desktop-nav a:hover::after,.journey-desktop-nav a:focus-visible::after,.journey-desktop-nav a.is-active::after { transform: scaleX(1); transform-origin: left; }
        .journey-header-cta,.journey-primary-cta { display: inline-flex; width: fit-content; align-items: center; justify-content: center; min-height: 44px; padding: .72rem 1.05rem; background: var(--highlight); color: #fff; text-decoration: none; font-weight: 600; border-radius: 4px; transition: background var(--dur-fast) ease, outline-color var(--dur-fast) ease; }
        .journey-header-cta.is-active { outline: 1px solid rgba(255,255,255,.82); outline-offset: 3px; }
        .journey-header-cta:hover,.journey-primary-cta:hover { background: var(--highlight-hover); }
        .journey-menu-toggle,.journey-mobile-menu { display: none; }
        .journey-progress { position: fixed; z-index: 9; top: 71px; right: 0; left: 0; height: 1px; background: rgba(255,255,255,.12); pointer-events: none; }
        .journey-progress-fill { position: absolute; inset: 0; background: #fff; transform: scaleX(0); transform-origin: left; will-change: transform; }
        .journey-progress-stops { position: absolute; inset: 0 var(--gutter); display: flex; justify-content: space-between; align-items: center; }
        .journey-progress-stops span { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,.56); box-shadow: 0 0 0 2px rgba(0,8,53,.82); }
        .journey-stop { --stop-accent: #1367fe; position: relative; display: flex; align-items: center; padding: 6rem var(--gutter); }
        .journey-stop--end { justify-content: flex-end; }
        .journey-panel { width: min(43rem,48vw); padding: clamp(1.4rem,3vw,2.8rem); background: linear-gradient(105deg,rgba(0,5,31,.96),rgba(0,8,53,.78) 72%,transparent); will-change: transform,opacity; }
        .journey-stop--end .journey-panel { background: linear-gradient(255deg,rgba(0,5,31,.96),rgba(0,8,53,.78) 72%,transparent); }
        .journey-panel h1,.journey-panel h2 { max-width: 12ch; margin: 0; color: #fff; font-size: clamp(2.65rem,6.4vw,6rem); font-weight: 300; letter-spacing: -.04em; line-height: .94; text-wrap: balance; overflow-wrap: anywhere; }
        .journey-panel h2 { font-size: clamp(2.35rem,5vw,4.5rem); }
        .journey-panel h3 { color: #fff; font-size: clamp(1.05rem,1.5vw,1.28rem); font-weight: 500; line-height: 1.2; }
        .journey-eyebrow,.journey-region { margin: 0 0 1.2rem; color: color-mix(in srgb,var(--stop-accent) 74%,white); font-size: .8rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
        .journey-body,.journey-company-line,.journey-statement { max-width: 46ch; margin: 1.35rem 0 0; color: rgba(255,255,255,.88); font-size: clamp(1rem,1.3vw,1.18rem); line-height: 1.62; }
        .journey-proof { margin: 1.5rem 0 0; color: #fff; font-size: clamp(1.4rem,2.7vw,2.45rem); font-weight: 300; letter-spacing: -.025em; line-height: 1.08; }
        .journey-capabilities { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.35rem 0 0; padding: 0; list-style: none; }
        .journey-capabilities li { padding: .42rem .68rem; border: 1px solid color-mix(in srgb,var(--stop-accent) 52%,transparent); color: rgba(255,255,255,.9); font-size: .74rem; background: rgba(0,8,53,.7); }
        .journey-links { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1.4rem; margin-top: 1.25rem; }
        .journey-links a { display: inline-flex; min-height: 48px; align-items: center; color: #fff; text-underline-offset: .35em; text-decoration-color: var(--stop-accent); font-weight: 600; }
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
        .journey-primary-cta { margin-top: 1.7rem; }.journey-back-to-top { display: flex; width: fit-content; min-height: 44px; align-items: center; gap: .55rem; margin-top: 1rem; color: rgba(255,255,255,.82); font-size: .82rem; text-underline-offset: .35em; }.journey-footer { display: flex; justify-content: space-between; gap: 1.5rem; margin-top: 4rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,.13); color: var(--text-mid); font-size: .7rem; }
        .journey-footer p { margin: 0; }
        @media (max-width: 900px) {
          .journey-header { height: 64px; grid-template-columns: 1fr auto auto; }.journey-desktop-nav { display: none; }.journey-wordmark { font-size: .82rem; }
          /* Keep the one primary action visible on phones; the menu still lists Partner. */
          .journey-header-cta { min-height: 40px; padding: .5rem .75rem; font-size: .72rem; }
          .journey-menu-toggle { display: grid; width: 44px; height: 44px; place-content: center; gap: 6px; padding: 0; border: 0; background: transparent; color: #fff; cursor: pointer; }
          .journey-menu-toggle span { display: block; width: 22px; height: 1px; background: currentColor; transition: transform var(--dur-fast) var(--ease-reveal); }
          .journey-menu-toggle[aria-expanded="true"] span:first-child { transform: translateY(3.5px) rotate(45deg); }.journey-menu-toggle[aria-expanded="true"] span:last-child { transform: translateY(-3.5px) rotate(-45deg); }
          .journey-progress { top: 63px; }
          .journey-progress-stops { inset-inline: var(--gutter); }
          .journey-mobile-menu { position: fixed; z-index: 7; inset: 64px 0 0; display: flex; flex-direction: column; padding: clamp(2.5rem,9vh,5rem) var(--gutter); background: rgba(0,5,31,.985); opacity: 0; pointer-events: none; transform: translateY(-12px); transition: opacity var(--dur-med) var(--ease-reveal),transform var(--dur-med) var(--ease-reveal); }
          .journey-mobile-menu.is-open { opacity: 1; pointer-events: auto; transform: translateY(0); }
          .journey-mobile-menu a { display: flex; min-height: 58px; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.13); color: rgba(255,255,255,.72); font-size: clamp(1.35rem,7vw,2rem); font-weight: 300; letter-spacing: -.02em; text-decoration: none; }
          .journey-mobile-menu a.is-active { color: #fff; }.journey-mobile-menu a span:last-child { color: var(--highlight); font-size: .9em; }
          .journey-static-image { object-position: 65% center; }.journey-stop,.journey-stop--end { align-items: flex-end; justify-content: stretch; padding: 5rem 0 0; }
          .journey-stop:first-child { min-height: 100svh !important; }
          .journey-panel,.journey-stop--end .journey-panel { width: 100%; padding: 5.5rem var(--gutter) max(1.5rem,env(safe-area-inset-bottom)); background: linear-gradient(0deg,rgba(0,5,31,.98),rgba(0,8,53,.84) 62%,transparent); }
          .journey-panel h1,.journey-panel h2 { font-size: clamp(2.45rem,12vw,4.6rem); }.journey-pillars,.journey-stats { grid-template-columns: 1fr; gap: .85rem; }.journey-pillars article>p:last-child { font-size: .84rem; }.journey-footer { flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* NeonJourney renders one motionless 3D frame in reduced-motion
             mode, so the licensed SUV remains visible without animation. */
          .journey-static-frame { opacity: 0 !important; transform: none !important; }
          .journey-stop { min-height: auto !important; padding-block: clamp(5rem,12vw,8rem); }.journey-panel { will-change: auto; opacity: 1 !important; transform: none !important; }
          .journey-mobile-menu,.journey-menu-toggle span,.journey-desktop-nav a::after { transition: none !important; }
        }
        html.webgl-unavailable .journey-webgl { display: none !important; }
        html.webgl-unavailable .journey-static-frame { opacity: 1 !important; transform: none !important; }
      `}</style>
    </main>
  );
}
