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
  const [activeSection, setActiveSection] = useState<NavSection | null>("group");
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
      // Sections without a nav owner (e.g. the numbers stack) clear the
      // highlight instead of leaving the previous item stuck active.
      setActiveSection((active as NavSection | undefined) ?? null);
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

    // The streaks and the scroll cue belong to the opening frame only: both
    // dissolve over the first 40% of the opening stop's scroll.
    if (stops[0]) {
      gsap.to(".journey-streaks, .journey-scroll-cue", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: stops[0], start: "top top", end: "40% top", scrub: true },
      });
    }

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
      {/* Light streaks behind the opening statement: fixed between the WebGL
          canvas (z 1) and the copy layer (z 3), masked to the upper half of
          the frame so they read as passing behind the SUV plate. GSAP fades
          the layer out as the opening stop scrolls away. */}
      <div className="journey-streaks" aria-hidden="true">
        <span className="journey-streak journey-streak--1" />
        <span className="journey-streak journey-streak--2" />
        <span className="journey-streak journey-streak--3" />
      </div>
      <Header />

      <div ref={journeyRef} className="journey-copy-layer">
        <Stop
          id="group"
          kind="hero"
          accent={stopAccents.hero}
          label="World Automotive Group"
          navSection="group"
          overlay={
            /* The nav carries the brand; the opening frame carries ONE
               statement. This cue is the only other element in the frame. */
            <div className="journey-scroll-cue" aria-hidden="true">
              <span className="journey-scroll-cue-label">Scroll</span>
              <span className="journey-scroll-cue-line" />
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
        .journey-signal { color: var(--highlight); }
        /* Header chrome (.journey-header and friends) is shared with the
           inner pages and lives in globals.css. Only the homepage-specific
           progress rail stays here. */
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
        /* Light streaks — three masked gradient beams on slow 20–30s drift
           loops in the journey palette (blue #1367fe / orange #ff4200). The
           vertical mask holds them above the horizon, behind the SUV plate. */
        .journey-streaks { position: fixed; inset: 0; z-index: 2; overflow: hidden; pointer-events: none; -webkit-mask-image: linear-gradient(180deg,transparent 0,#000 12%,#000 46%,transparent 72%); mask-image: linear-gradient(180deg,transparent 0,#000 12%,#000 46%,transparent 72%); }
        .journey-streak { position: absolute; left: -30vw; width: 160vw; border-radius: 999px; will-change: translate; }
        .journey-streak--1 { top: 26%; height: 2px; transform: rotate(-8deg); background: linear-gradient(90deg,transparent 6%,rgba(19,103,254,.7) 42%,rgba(66,215,255,.8) 55%,transparent 94%); filter: blur(1px) drop-shadow(0 0 6px rgba(19,103,254,.75)); animation: journeyStreakDrift 26s ease-in-out -8s infinite alternate; }
        .journey-streak--2 { top: 34%; height: 130px; transform: rotate(-10deg); background: linear-gradient(100deg,transparent 12%,rgba(19,103,254,.13) 44%,rgba(255,66,0,.09) 62%,transparent 88%); filter: blur(28px); animation: journeyStreakDrift 30s ease-in-out infinite alternate-reverse; }
        .journey-streak--3 { top: 17%; height: 1px; transform: rotate(-6deg); background: linear-gradient(90deg,transparent 10%,rgba(255,66,0,.6) 52%,transparent 90%); filter: blur(.6px) drop-shadow(0 0 5px rgba(255,66,0,.6)); animation: journeyStreakDrift 21s ease-in-out -14s infinite alternate; }
        @keyframes journeyStreakDrift { from { translate: -7vw 0; } to { translate: 7vw 0; } }
        /* Scroll cue — bottom-centre of the first viewport (the opening stop
           is 118svh tall, so 18svh up from its bottom edge = the fold). */
        .journey-scroll-cue { position: absolute; z-index: 4; left: 50%; bottom: calc(18svh + 2.2rem); display: flex; flex-direction: column; align-items: center; gap: .75rem; transform: translateX(-50%); pointer-events: none; }
        .journey-scroll-cue-label { color: rgba(255,255,255,.62); font-size: .66rem; font-weight: 600; letter-spacing: .34em; text-indent: .34em; text-transform: uppercase; }
        .journey-scroll-cue-line { position: relative; width: 1px; height: 56px; overflow: hidden; background: rgba(255,255,255,.16); }
        .journey-scroll-cue-line::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg,transparent,#fff 45%,rgba(255,255,255,.9) 60%,transparent); transform: translateY(-100%); animation: journeyScrollCue 2.4s cubic-bezier(.55,.08,.35,.92) .8s infinite; }
        @keyframes journeyScrollCue { 0% { transform: translateY(-100%); } 62% { transform: translateY(100%); } 100% { transform: translateY(100%); } }
        .journey-panel h2 { font-size: clamp(2.35rem,5vw,4.5rem); }
        /* hero statement — the single anchor of the opening frame now that the
           wordmark overlay is gone (the nav carries the brand). Display voice,
           promoted scale. Every other journey heading stays Suisse. */
        .journey-panel h1 { max-width: 11ch; font-family: var(--font-display); font-weight: var(--font-display-weight); font-size: clamp(4rem,9vw,10rem); letter-spacing: var(--tracking-display); line-height: .96; }
        /* the promoted statement needs a wider panel than the company cards */
        .journey-stop--kind-hero .journey-panel { width: min(58rem,62vw); }
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
          .journey-progress { top: 63px; }
          .journey-progress-stops { inset-inline: var(--gutter); }
          .journey-static-image { object-position: 65% center; }.journey-stop,.journey-stop--end { align-items: flex-end; justify-content: stretch; padding: 5rem 0 0; }
          .journey-stop:first-child { min-height: 100svh !important; }
          .journey-panel,.journey-stop--end .journey-panel { width: 100%; padding: 5.5rem var(--gutter) max(1.5rem,env(safe-area-inset-bottom)); background: linear-gradient(0deg,rgba(0,5,31,.98),rgba(0,8,53,.84) 62%,transparent); -webkit-mask-image: none; mask-image: none; }
          .journey-panel h2 { font-size: clamp(2.45rem,12vw,4.6rem); }
          /* first stop is 100svh on mobile: park the cue at the true bottom
             and clear room for it under the statement. The anchor statement
             steps down so "Automotive." holds as one word on a 390px screen. */
          .journey-panel h1 { max-width: none; font-size: clamp(3rem,14.2vw,5.5rem); }
          .journey-stop--kind-hero .journey-panel { width: 100%; padding-bottom: 5rem; }
          .journey-scroll-cue { bottom: 1.1rem; gap: .55rem; }
          .journey-scroll-cue-line { height: 34px; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* NeonJourney renders one motionless 3D frame in reduced-motion
             mode, so the licensed SUV remains visible without animation. */
          .journey-static-frame { opacity: 0 !important; transform: none !important; }
          .journey-stop { min-height: auto !important; padding-block: clamp(5rem,12vw,8rem); }.journey-panel { will-change: auto; opacity: 1 !important; transform: none !important; }
          /* streaks hold still; the cue (pure motion affordance, and placed
             for the full-viewport layout this mode collapses) goes away */
          .journey-streak { animation: none; }
          .journey-scroll-cue { display: none; }
        }
        html.webgl-unavailable .journey-webgl { display: none !important; }
        html.webgl-unavailable .journey-static-frame { opacity: 1 !important; transform: none !important; }
      `}</style>
    </main>
  );
}
