"use client";

import Link from "next/link";
import Image from "next/image";
import { Children, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { companies, nav } from "@/content/site";
import { StoryTail } from "@/components/about/StoryTail";
import { ClientsCarousel } from "@/components/about/ClientsCarousel";
import { NeonJourney } from "./NeonJourney";
import { journeyContent, stopAccents } from "./journeyContent";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION = {
  stopHeight: "118svh",
  revealScrub: 1.15,
  exitScrub: 0.9,
  firstCardRevealStart: "top 82%",
  firstCardRevealEnd: "top 35%",
} as const;

const revealFrom = {
  hero: { yPercent: 8, opacity: 0 },
  intro: { xPercent: -12, opacity: 0 },
  company: { yPercent: 16, scale: 0.96, opacity: 0 },
} as const;

type StopProps = {
  id?: string;
  kind: keyof typeof revealFrom;
  accent: string;
  align?: "start" | "end" | "center";
  children: React.ReactNode;
  label: string;
  navSection: "group" | "companies";
  /** rendered as a sibling of the panel (no panel background) */
  overlay?: React.ReactNode;
};

function Stop({ id, kind, accent, align = "start", children, label, navSection, overlay }: StopProps) {
  return (
    <section
      id={id}
      data-journey-stop
      data-stop-kind={kind}
      data-nav-section={navSection}
      className={`journey-stop journey-stop--${align} journey-stop--kind-${kind}`}
      style={{ minHeight: MOTION.stopHeight, "--stop-accent": accent } as React.CSSProperties}
      aria-label={label}
    >
      {overlay}
      <div className="journey-panel">{Children.toArray(children)}</div>
    </section>
  );
}

/* Progress-rail markers for the merged page: the seven journey stops plus the
   Madar-machine story tail sections. */
const journeyStops = [
  { id: "group", label: "The Group" },
  { id: "companies", label: "Companies" },
  ...companies.map((company) => ({ id: `company-${company.slug}`, label: company.name })),
  { id: "story", label: "One Operator, Many Engines" },
  { id: "model", label: "The Model" },
  { id: "heritage", label: "Heritage" },
  { id: "numbers", label: "Group Numbers" },
  { id: "companies-recap", label: "Companies Recap" },
  { id: "partner", label: "Partner With Us" },
] as const;

const headerLinks = [
  { label: "The Group", href: "#story", section: "group" },
  { label: "Companies", href: "#companies", section: "companies" },
  { label: "The Model", href: "#model", section: "model" },
  { label: "Heritage", href: "#heritage", section: "heritage" },
  { label: "Team", href: "#team", section: "team" },
  { label: "Partner", href: "#partner", section: "partner" },
] as const;

type NavSection = (typeof headerLinks)[number]["section"];

const companyProofHighlights: Record<(typeof companies)[number]["slug"], string> = {
  fasttrack: "32",
  autodata: "Inspections",
  axxion: "first",
  "pag-direct": "30+",
  vicimus: "Retention",
};

function SignalWord({ children }: { children: React.ReactNode }) {
  return <span className="journey-signal">{children}</span>;
}

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  const start = text.indexOf(highlight);
  if (start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <SignalWord>{highlight}</SignalWord>
      {text.slice(start + highlight.length)}
    </>
  );
}

function Header() {
  const [activeSection, setActiveSection] = useState<NavSection>("group");
  const [onLight, setOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One rAF-throttled probe serves both scroll engines (journey stops +
    // Madar-machine tail): the [data-nav-section] element under the viewport
    // centre owns the active nav state (last match wins, so the heritage
    // marker nested in the centerpiece overrides its parent), and the
    // [data-ax-theme] section under the header line owns the dark/light flip.
    let raf = 0;
    const check = () => {
      let light = false;
      for (const el of document.querySelectorAll<HTMLElement>("[data-ax-theme]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) {
          light = el.dataset.axTheme === "light";
          break;
        }
      }
      setOnLight(light);

      const probe = window.innerHeight / 2;
      let active: string | undefined;
      for (const el of document.querySelectorAll<HTMLElement>("[data-nav-section]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) active = el.dataset.navSection;
      }
      if (active) setActiveSection(active as NavSection);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Progress rail: ScrollTrigger already owns scroll on this page, so it
    // drives the fill too — no parallel window scroll listener. It also
    // re-measures on resize/refresh for free. It spans the WHOLE merged page
    // (journey + tail), unlike the camera trigger which caps at the wrapper.
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
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
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

  const light = onLight && !menuOpen;

  return (
    <>
      <header className={`journey-header${light ? " journey-header--light" : ""}`}>
        <Link href="/" className="wag-wordmark journey-wordmark" aria-label="WORLDAUTO GROUP home">
          <strong>WORLD<span>AUTO</span></strong>
          <span>{nav.wordmark.thin}</span>
        </Link>
        <nav className="journey-desktop-nav" aria-label="Journey navigation">
          {headerLinks.slice(0, 5).map((link) => (
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

      <div className={`journey-progress${light ? " journey-progress--light" : ""}`} aria-hidden="true">
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
      /* middle company gets a centered interlude beat so the run of stops is
         not a strict left/right ping-pong (audit finding: stop rhythm) */
      align={
        index === Math.floor(companies.length / 2)
          ? "center"
          : index % 2 === 0
            ? "end"
            : "start"
      }
      label={company.name}
      navSection="companies"
    >
      <p className="journey-region">{company.region}</p>
      <h2>{company.name}</h2>
      <p className="journey-company-line">{company.oneLiner}</p>
      <p className="journey-proof">
        <HighlightedText text={company.proof} highlight={companyProofHighlights[company.slug]} />
      </p>
      <ul className="journey-capabilities" aria-label={`${company.name} capabilities`}>
        {company.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
      </ul>
      <div className="journey-links">
        <Link href={`/companies/${company.slug}`}>Explore {company.name} →</Link>
        <a href={company.url} target="_blank" rel="noreferrer">Visit site</a>
      </div>
      {company.slug === "autodata" && <ClientsCarousel />}
    </Stop>
  );
}

export function LandingJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The /about -> /#story 308 redirect preserves the fragment, but browsers
    // can skip (or later reset) the fragment scroll on redirected loads. If we
    // arrive with a hash and the page is still parked at the top, perform the
    // jump ourselves — retrying briefly in case the browser resets to 0 after
    // load or a ScrollTrigger refresh re-measures the tall layout.
    const id = window.location.hash.slice(1);
    if (!id) return;
    const attempt = () => {
      const el = document.getElementById(id);
      // idempotent: re-jump only while the target isn't at the top, so a
      // native fragment scroll against a stale (still-growing) layout, or a
      // reset to 0, gets corrected — and a correct landing is left alone.
      if (el && Math.abs(el.getBoundingClientRect().top) > 2) el.scrollIntoView();
    };
    const raf = requestAnimationFrame(attempt);
    const timers = [150, 450, 1000].map((ms) => window.setTimeout(attempt, ms));
    window.addEventListener("load", attempt);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", attempt);
    };
  }, []);

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
      } else if (index === 1) {
        // Prototype: reveal the first incoming card in the same vertical
        // direction as the road appears to travel. The panel remains anchored
        // while a crisp mask uncovers it from top to bottom.
        gsap.fromTo(
          panel,
          { clipPath: "inset(0 0 100% 0)", opacity: 1 },
          {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            ease: "quart.out",
            scrollTrigger: {
              trigger: panel,
              start: MOTION.firstCardRevealStart,
              end: MOTION.firstCardRevealEnd,
              scrub: MOTION.revealScrub,
            },
          },
        );
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

      // Every stop exits — including the last one, which fades before the
      // story tail's opaque sections slide over the fixed canvas.
      gsap.fromTo(
        panel,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -10,
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
    });
  }, { scope: rootRef });

  return (
    <main ref={rootRef} id="main" className="landing-journey">
      {/* Inline opacity:0 hides this before hydration too, so the poster never
          flashes while the styled-jsx sheet is still loading. The
          `html.webgl-unavailable` / reduced-motion rules use `!important`, which
          beats this inline style, so the fallback still appears when needed. */}
      <div className="journey-static-frame" aria-hidden="true" style={{ opacity: 0 }}>
        <Image
          className="journey-static-image"
          src="/hero/suv-neon.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <NeonJourney boundsRef={journeyRef} />
      <Header />

      <div ref={journeyRef} className="journey-copy-layer">
        <Stop
          id="group"
          kind="hero"
          accent={stopAccents.hero}
          label="World Automotive Group"
          navSection="group"
          overlay={
            <div className="hero-wordmark-overlay" aria-label="World Automotive Group">
              <span className="hero-wordmark">
                <span className="hw-lockup">
                  <span className="hw-word">WORLD</span>{" "}
                  <span className="hw-word hw-auto">AUTOMOTIVE</span>{" "}
                  <span className="hw-word">GROUP</span>
                </span>
                <svg className="hw-route" viewBox="0 0 1000 64" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="hw-route-blue"
                    pathLength={1}
                    fill="none"
                    d="M0 14 H110 a16 16 0 0 1 16 16 V32 a16 16 0 0 0 16 16 H1000"
                  />
                </svg>
              </span>
            </div>
          }
        >
          <h1>We Build And Run <SignalWord>Automotive.</SignalWord></h1>
          <p className="journey-body">{journeyContent.hero.body}</p>
        </Stop>

        <Stop id="companies" kind="intro" accent={stopAccents.companies} align="end" label="Companies" navSection="companies">
          <h2><SignalWord>Five</SignalWord> companies, one standard.</h2>
        </Stop>

        {companies.map((company, index) => <CompanyStop key={company.slug} company={company} index={index} />)}
      </div>

      {/* The journey ends here; the Madar-machine story tail takes over in
          normal flow. Its opaque sections cover the fixed canvas, which also
          stops rendering once the journey wrapper has scrolled past. */}
      <StoryTail />

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
        .journey-signal { color: var(--highlight); }
        .journey-desktop-nav { display: flex; justify-content: center; gap: clamp(1rem,2.4vw,2.5rem); }
        .journey-desktop-nav a,.journey-header-cta { position: relative; display: inline-flex; min-height: 44px; align-items: center; color: var(--text-mid); text-decoration: none; font-size: .6875rem; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; white-space: nowrap; transition: color var(--dur-fast) ease; }
        .journey-desktop-nav a::after { position: absolute; right: 0; bottom: 7px; left: 0; height: 1px; background: currentColor; content: ""; transform: scaleX(0); transform-origin: right; transition: transform var(--dur-fast) var(--ease-reveal); }
        .journey-desktop-nav a:hover,.journey-desktop-nav a:focus-visible,.journey-desktop-nav a.is-active { color: #fff; }
        .journey-desktop-nav a:hover::after,.journey-desktop-nav a:focus-visible::after,.journey-desktop-nav a.is-active::after { transform: scaleX(1); transform-origin: left; }
        .journey-header-cta { display: inline-flex; width: fit-content; align-items: center; justify-content: center; min-height: 44px; padding: .72rem 1.05rem; background: var(--highlight); color: #fff; text-decoration: none; border-radius: 4px; transition: background var(--dur-fast) ease, outline-color var(--dur-fast) ease; }
        .journey-header-cta.is-active { outline: 1px solid rgba(255,255,255,.82); outline-offset: 3px; }
        .journey-header-cta:hover { background: var(--highlight-hover); }
        .journey-menu-toggle,.journey-mobile-menu { display: none; }
        /* Theme flip: the story tail has ui-light sections; the header and the
           progress rail re-skin so the nav stays legible over paper. */
        .journey-header { transition: background .45s ease; }
        .journey-header--light { background: linear-gradient(180deg,rgba(255,255,255,.97),rgba(255,255,255,.66) 70%,transparent); }
        .journey-header--light .journey-wordmark { color: var(--wag-ink); }
        .journey-header--light .journey-wordmark > span { color: rgba(7,9,14,.62); }
        .journey-header--light .journey-desktop-nav a { color: rgba(7,9,14,.66); }
        .journey-header--light .journey-desktop-nav a:hover,.journey-header--light .journey-desktop-nav a:focus-visible,.journey-header--light .journey-desktop-nav a.is-active { color: var(--wag-ink); }
        .journey-header--light .journey-header-cta.is-active { outline-color: rgba(7,9,14,.7); }
        .journey-header--light .journey-menu-toggle { color: var(--wag-ink); }
        .journey-progress--light { background: rgba(7,9,14,.16); }
        .journey-progress--light .journey-progress-fill { background: var(--wag-ink); }
        .journey-progress--light .journey-progress-stops span { background: rgba(7,9,14,.45); box-shadow: 0 0 0 2px rgba(255,255,255,.8); }
        .journey-progress { position: fixed; z-index: 9; top: 71px; right: 0; left: 0; height: 1px; background: rgba(255,255,255,.12); pointer-events: none; }
        .journey-progress-fill { position: absolute; inset: 0; background: #fff; transform: scaleX(0); transform-origin: left; will-change: transform; }
        .journey-progress-stops { position: absolute; inset: 0 var(--gutter); display: flex; justify-content: space-between; align-items: center; }
        .journey-progress-stops span { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,.56); box-shadow: 0 0 0 2px rgba(0,8,53,.82); }
        .journey-stop { --stop-accent: #1367fe; position: relative; display: flex; align-items: center; padding: 6rem var(--gutter); }
        .journey-stop--end { justify-content: flex-end; }
        .journey-panel { width: min(43rem,48vw); padding: clamp(1.4rem,3vw,2.8rem); background: linear-gradient(105deg,rgba(0,5,31,.96) 0%,rgba(0,8,53,.82) 52%,rgba(0,6,42,.42) 78%,transparent 100%); -webkit-mask-image: linear-gradient(180deg,transparent 0%,#000 9%,#000 91%,transparent 100%); mask-image: linear-gradient(180deg,transparent 0%,#000 9%,#000 91%,transparent 100%); will-change: transform,opacity; }
        .journey-stop--end .journey-panel { background: linear-gradient(255deg,rgba(0,5,31,.96) 0%,rgba(0,8,53,.82) 52%,rgba(0,6,42,.42) 78%,transparent 100%); }
        .journey-stop--center { justify-content: center; }
        .journey-stop--center .journey-panel { width: min(40rem,64vw); text-align: center; background: linear-gradient(180deg,rgba(0,6,42,.32) 0%,rgba(0,8,53,.9) 26%,rgba(0,8,53,.9) 74%,rgba(0,6,42,.32) 100%); }
        .journey-stop--center .journey-panel h2 { max-width: none; }
        .journey-stop--center .journey-body,.journey-stop--center .journey-company-line,.journey-stop--center .journey-proof { margin-left: auto; margin-right: auto; }
        .journey-stop--center .journey-capabilities,.journey-stop--center .journey-links { justify-content: center; }
        .journey-panel h1,.journey-panel h2 { max-width: 12ch; margin: 0; color: #fff; font-size: clamp(2.65rem,6.4vw,6rem); font-weight: 300; letter-spacing: -.04em; line-height: .94; text-wrap: balance; overflow-wrap: anywhere; }
        /* hero wordmark: WORLD AUTOMOTIVE GROUP floats over the car, NO background;
           the bottom headline card is unchanged. Lines match the neon road
           (blue #1367fe / orange #ff4200 + bloom glow) and draw in on load. */
        .hero-wordmark-overlay { position: absolute; z-index: 3; top: clamp(6rem,15vh,9.5rem); left: 0; right: 0; padding: 0 var(--gutter); text-align: center; pointer-events: none; }
        .hero-wordmark { position: relative; display: inline-block; padding-bottom: clamp(.9rem,2.2vw,1.7rem); white-space: nowrap; }
        .hero-wordmark .hw-lockup { display: inline-block; font-size: clamp(1.5rem,4.4vw,3.6rem); font-weight: 700; letter-spacing: .01em; line-height: .92; color: #fff; }
        .hero-wordmark .hw-auto { position: relative; color: var(--highlight); }
        .hero-wordmark .hw-auto::after { content: ""; position: absolute; left: 0; right: 0; bottom: -.18em; height: 4px; border-radius: 2px; background: #ff4200; filter: drop-shadow(0 0 3px #ff4200) drop-shadow(0 0 8px rgba(255,66,0,.6)); transform-origin: left center; }
        .hero-wordmark .hw-route { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: clamp(.9rem,2vw,1.6rem); overflow: visible; }
        .hero-wordmark .hw-route-blue { stroke: #1367fe; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 3px #1367fe) drop-shadow(0 0 8px rgba(19,103,254,.55)); }
        @media (prefers-reduced-motion: no-preference) {
          .hero-wordmark .hw-route-blue { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hwDraw 1.1s cubic-bezier(.16,1,.3,1) .35s forwards; }
          .hero-wordmark .hw-auto::after { transform: scaleX(0); animation: hwGrow .7s cubic-bezier(.16,1,.3,1) 1.05s forwards; }
        }
        @keyframes hwDraw { to { stroke-dashoffset: 0; } }
        @keyframes hwGrow { to { transform: scaleX(1); } }
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
        /* AutoData clients marquee — full-colour transparent logos on one soft
           light tray (no per-logo cards). The tray fades at both ends. */
        .journey-clients { margin-top: 1.5rem; max-width: 100%; }
        .journey-clients-marquee { position: relative; overflow: hidden; background: rgba(255,255,255,.95); border-radius: 10px; -webkit-mask-image: linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent); mask-image: linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent); }
        .journey-clients-track { display: flex; width: max-content; gap: 30px; padding: 12px 26px; animation: journeyClients 40s linear infinite; will-change: transform; }
        .journey-clients-marquee:hover .journey-clients-track { animation-play-state: paused; }
        @keyframes journeyClients { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .journey-clients-chip { flex: 0 0 auto; height: 40px; display: inline-flex; align-items: center; justify-content: center; }
        .journey-clients-chip img { height: 30px; width: auto; max-width: 140px; object-fit: contain; display: block; }
        @media (prefers-reduced-motion: reduce) {
          .journey-clients-marquee { -webkit-mask-image: none; mask-image: none; }
          .journey-clients-track { animation: none; flex-wrap: wrap; width: auto; justify-content: center; gap: 22px; }
          .journey-clients-dup { display: none; }
        }
        @media (max-width: 900px) {
          .journey-header { height: 64px; grid-template-columns: 1fr auto auto; }.journey-desktop-nav { display: none; }.journey-wordmark { font-size: .82rem; }
          /* Keep the one primary action visible on phones; the menu still lists Partner. */
          .journey-header-cta { min-height: 40px; padding: .5rem .75rem; font-size: .62rem; letter-spacing: .14em; }
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
          .journey-panel,.journey-stop--end .journey-panel { width: 100%; padding: 5.5rem var(--gutter) max(1.5rem,env(safe-area-inset-bottom)); background: linear-gradient(0deg,rgba(0,5,31,.98),rgba(0,8,53,.84) 62%,transparent); -webkit-mask-image: none; mask-image: none; }
          .journey-panel h1,.journey-panel h2 { font-size: clamp(2.45rem,12vw,4.6rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          /* NeonJourney renders one motionless 3D frame in reduced-motion
             mode, so the licensed SUV remains visible without animation. */
          .journey-static-frame { opacity: 0 !important; transform: none !important; }
          .journey-stop { min-height: auto !important; padding-block: clamp(5rem,12vw,8rem); }.journey-panel { will-change: auto; opacity: 1 !important; transform: none !important; }
          .journey-header,.journey-mobile-menu,.journey-menu-toggle span,.journey-desktop-nav a::after { transition: none !important; }
        }
        html.webgl-unavailable .journey-webgl { display: none !important; }
        html.webgl-unavailable .journey-static-frame { opacity: 1 !important; transform: none !important; }
      `}</style>
    </main>
  );
}
