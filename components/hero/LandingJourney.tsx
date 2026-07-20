"use client";

import Link from "next/link";
import Image from "next/image";
import { Children, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { companies, nav } from "@/content/site";
import { StoryTail } from "@/components/about/StoryTail";
import { ClientsCarousel } from "@/components/about/ClientsCarousel";
import { JourneyExploreLink } from "@/components/site/CompanyPreview";
import { NeonJourney } from "./NeonJourney";
import { journeyContent, stopAccents } from "./journeyContent";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

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

const headerLinks = [
  { label: "The Group", href: "#story", section: "group" },
  { label: "Companies", href: "#companies", section: "companies" },
  { label: "The Model", href: "#model", section: "model" },
  { label: "Heritage", href: "#heritage", section: "heritage" },
  { label: "Team", href: "#team", section: "team" },
  { label: "Partner", href: "#partner", section: "partner" },
] as const;

type NavSection = (typeof headerLinks)[number]["section"];

/* Chapter ranges — ORDERED document positions, the ONE source of truth for
   BOTH scrollspies (design review: the top nav's own element probe could
   disagree with the rail — THE GROUP underlined while the rail ticked
   03 THE MODEL). The active chapter is the last one whose start element
   has passed the viewport centre, so the tick can only ever move forward
   while scrolling down. Every band belongs to a chapter: the
   story/foresight/commitment band opens The Model, the numbers band and
   companies recap ride out the Team chapter, and Partner picks up at the
   verticals ("who we partner with"). `section` names the header nav item
   the chapter lights up; clicks tween to the chapter's range start. */
const railChapters = [
  { label: "The Group", id: "group", section: "group" },
  { label: "Companies", id: "companies", section: "companies" },
  { label: "The Model", id: "story", section: "model" },
  { label: "Heritage", id: "heritage", section: "heritage" },
  { label: "Team", id: "team", section: "team" },
  { label: "Partner", id: "verticals", section: "partner" },
] as const;

// Readable button ink per stop hue: white on the deep hues, near-black navy
// on the two light hues (AutoData cyan, Vicimus green). Matches the grid.
const stopInk: Record<string, string> = {
  fasttrack: "#ffffff",
  autodata: "#02040f",
  axxion: "#ffffff",
  "pag-direct": "#ffffff",
  vicimus: "#02040f",
};

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

/* Smooth-tween any orientation click (rail chapters, company tabs) to its
   target. Reduced-motion users get an instant jump instead. */
function tweenToElement(el: HTMLElement | null) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollIntoView();
    return;
  }
  gsap.to(window, {
    duration: 0.9,
    ease: "power2.inOut",
    overwrite: "auto",
    scrollTo: { y: el, autoKill: true },
  });
}

function Header() {
  const [activeSection, setActiveSection] = useState<NavSection | null>("group");
  const [onLight, setOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* left chapter rail: hidden over the hero frame, ticks the chapter whose
     ordered range owns the viewport centre (monotonic — never runs backward
     on the way down). Light/dark ink is a masked duplicate pair driven by
     CSS vars, so each pixel row of the rail matches the band beneath it. */
  const [railVisible, setRailVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  /* ticks-only mode while a light band crosses the rail box (the labels
     are unreadable over the dotted map plate) */
  const [railTicksOnly, setRailTicksOnly] = useState(false);
  const railRef = useRef<HTMLElement>(null);
  /* company tab rail: only while the journey's five company stops hold the
     viewport; underlines the stop under the centre line */
  const [tabsVisible, setTabsVisible] = useState(false);
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
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

      // Chapter rail: appears once the opening frame has mostly scrolled
      // away. Active chapter = the LAST ordered range start above the
      // viewport centre — monotonic by construction. The SAME chapter drives
      // the top-nav underline (setActiveSection below), so the two
      // indicators can never point at different chapters.
      const hero = document.getElementById("group");
      setRailVisible(!hero || hero.getBoundingClientRect().bottom < window.innerHeight * 0.5);
      let chapter = 0;
      railChapters.forEach((ch, i) => {
        const el = document.getElementById(ch.id);
        if (el && el.getBoundingClientRect().top <= probe) chapter = i;
      });
      setActiveChapter(chapter);
      setActiveSection(railChapters[chapter].section);

      // Rail ink mask: measure where the light bands intersect the rail's
      // own box and hand the union to CSS as percentages. The ink duplicate
      // is clipped TO that band and the dark duplicates to its complement,
      // so no label ever renders dark-on-dark at a light/dark boundary.
      const rail = railRef.current;
      if (rail) {
        const rr = rail.getBoundingClientRect();
        let bandTop = Infinity;
        let bandBottom = -Infinity;
        if (rr.height > 0) {
          for (const el of document.querySelectorAll<HTMLElement>('[data-ax-theme="light"], [data-rail-light]')) {
            const r = el.getBoundingClientRect();
            const top = Math.max(r.top, rr.top);
            const bottom = Math.min(r.bottom, rr.bottom);
            if (bottom > top) {
              bandTop = Math.min(bandTop, top);
              bandBottom = Math.max(bandBottom, bottom);
            }
          }
        }
        if (bandBottom > bandTop) {
          rail.style.setProperty("--rail-lt", `${(((bandTop - rr.top) / rr.height) * 100).toFixed(2)}%`);
          rail.style.setProperty("--rail-lb", `${(((bandBottom - rr.top) / rr.height) * 100).toFixed(2)}%`);
        } else {
          rail.style.setProperty("--rail-lt", "100%");
          rail.style.setProperty("--rail-lb", "100%");
        }
        // While ANY light band crosses the rail, drop to ticks-only (the
        // phone treatment): over the light dotted map plate the label
        // glyphs had map dots running through them (design review) — ticks
        // stay legible where 10px caps cannot.
        setRailTicksOnly(bandBottom > bandTop);
      }

      // Company tabs: live from the "Five companies" intro stop until the
      // last company stop leaves the centre line.
      const intro = document.getElementById("companies");
      const last = document.getElementById(`company-${companies[companies.length - 1].slug}`);
      setTabsVisible(
        !!intro && !!last &&
        intro.getBoundingClientRect().top <= probe &&
        last.getBoundingClientRect().bottom >= probe,
      );
      let current: string | null = null;
      for (const company of companies) {
        const el = document.getElementById(`company-${company.slug}`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) current = company.slug;
      }
      setActiveCompany(current);
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
      </div>

      {/* Fixed left chapter rail — the labelled replacement for the old
          unlabelled dot strip. Hidden over the hero. Rendered as a masked
          duplicate pair: one white-on-dark copy and one ink-on-light copy,
          clipped against each other along the measured light-band edges, so
          the flip happens per pixel row instead of all at once. The dark
          copy carries the accessible links; the clipped duplicates are
          decorative but still clickable where visible. */}
      <nav
        ref={railRef}
        className={`journey-rail${railVisible ? "" : " journey-rail--hidden"}${railTicksOnly ? " journey-rail--ticks" : ""}`}
        aria-label="Page chapters"
        aria-hidden={!railVisible}
      >
        {(["dark-top", "ink", "dark-bottom"] as const).map((copy) => (
          <div
            key={copy}
            className={`journey-rail-copy journey-rail-copy--${copy}`}
            aria-hidden={copy !== "dark-top" || undefined}
          >
            {railChapters.map((ch, i) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className={activeChapter === i ? "is-active" : undefined}
                aria-current={copy === "dark-top" && activeChapter === i ? "location" : undefined}
                aria-label={copy === "dark-top" ? `Chapter ${String(i + 1).padStart(2, "0")}: ${ch.label}` : undefined}
                tabIndex={copy === "dark-top" && railVisible ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault();
                  tweenToElement(document.getElementById(ch.id));
                }}
              >
                <span className="journey-rail-tick" aria-hidden="true" />
                <span className="journey-rail-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="journey-rail-label">{ch.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* Full-width navy scrim behind the company tab strip (design review):
          page copy scrolling up out of a stop dissolves to 0% under this
          gradient BEFORE it can reach the tab row — no more chips or journey
          copy running through FASTTRACK/AUTODATA/AXXION. Sits above the
          copy layer (z 3) and below the header and bars (z 8+). */}
      <div
        className={`journey-cotabs-scrim${tabsVisible ? " is-visible" : ""}`}
        aria-hidden="true"
      />

      {/* Company tab rail — a five-name index under the nav while the
          journey's company stops hold the frame. */}
      <nav
        className={`journey-cotabs${tabsVisible ? " is-visible" : ""}`}
        aria-label="Companies in this chapter"
        aria-hidden={!tabsVisible}
      >
        {companies.map((company) => (
          <button
            key={company.slug}
            type="button"
            className={activeCompany === company.slug ? "is-active" : undefined}
            aria-current={activeCompany === company.slug ? "location" : undefined}
            tabIndex={tabsVisible ? 0 : -1}
            onClick={() => tweenToElement(document.getElementById(`company-${company.slug}`))}
          >
            {company.name}
          </button>
        ))}
      </nav>

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

/* Per-stop signature scenes. The info card is LOCKED to one position across
   all five company stops; only this layer changes. Each motif follows the
   company's detail-page family in its hue:
   - FastTrack: forecourt canopy light-trails over the manifest forecourt
     imagery (#1367FE)
   - AutoData: none here — the WebGL valuation-curve terrain at its camera
     pose IS the motif (#42D7FF)
   - Axxion: none here — the WebGL routing-junction road lines at its camera
     pose carry the stop (#FF4200)
   - PAG Direct: none — scene graphic removed per CEO (2026-07-20); the
     WebGL road at its camera pose carries the stop
   - Vicimus: none — scene graphic removed per CEO (2026-07-20); the WebGL
     road at its camera pose carries the stop */
function CompanyScene({ slug }: { slug: string }) {
  if (slug === "fasttrack") {
    return (
      <div className="journey-scene journey-scene--fasttrack" data-journey-scene aria-hidden="true">
        <div className="journey-ft-frame">
          <div className="journey-ft-fade">
            <Image
              src="/images/forecourt-service-night.png"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 68vw"
              className="journey-ft-img"
            />
            <span className="journey-ft-tint" />
          </div>
        </div>
        <span className="journey-ft-trail journey-ft-trail--1" />
        <span className="journey-ft-trail journey-ft-trail--2" />
      </div>
    );
  }
  return null;
}

function CompanyStop({ company }: { company: (typeof companies)[number] }) {
  const accent = stopAccents[company.slug as keyof typeof stopAccents] ?? stopAccents.hero;
  return (
    <Stop
      id={`company-${company.slug}`}
      kind="company"
      accent={accent}
      /* The card is locked: one position (lower-left), one width, one internal
         order across all five stops. Only the scene behind it changes. */
      align="start"
      label={company.name}
      navSection="companies"
      overlay={<CompanyScene slug={company.slug} />}
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
        <JourneyExploreLink
          href={`/companies/${company.slug}`}
          className="journey-explore-btn"
          style={{ "--stop-ink": stopInk[company.slug] ?? "#ffffff" } as React.CSSProperties}
          slug={company.slug}
          name={company.name}
          hue={accent}
        >
          Explore {company.name} →
        </JourneyExploreLink>
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
        // Company cards sit low in their tall stop, so their reveal tracks
        // the PANEL's own entry through the fold — the stop's top edge is a
        // whole viewport ahead of the card and would finish the tween before
        // the card ever showed.
        const companyCard = kind === "company";
        gsap.fromTo(panel, revealFrom[kind], {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: companyCard ? panel : stop,
            start: companyCard ? "top 96%" : "top 82%",
            end: companyCard ? "top 58%" : "top 36%",
            scrub: MOTION.revealScrub,
          },
        });
      }

      // Signature scene behind the locked card: fades in with its stop and
      // dissolves on exit, slightly wider window than the card so the scene
      // frames the card's own entrance and exit.
      const scene = stop.querySelector<HTMLElement>("[data-journey-scene]");
      if (scene) {
        gsap.fromTo(
          scene,
          { opacity: 0, yPercent: 6 },
          {
            opacity: 1,
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: stop, start: "top 88%", end: "top 26%", scrub: MOTION.revealScrub },
          },
        );
        gsap.fromTo(
          scene,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "quart.in",
            immediateRender: false,
            scrollTrigger: { trigger: stop, start: "bottom 70%", end: "bottom 44%", scrub: MOTION.exitScrub },
          },
        );
      }

      // Every stop exits — including the last one, which fades before the
      // story tail's opaque sections slide over the fixed canvas.
      // Exit window retuned (design review): panels must be fully dissolved
      // before their top edge reaches the fixed header band, so the fade now
      // starts at bottom 75% and completes by bottom 52% — before the panel
      // copy can interleave with the wordmark, nav labels, or CTA.
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
            start: "bottom 75%",
            end: "bottom 52%",
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

        {companies.map((company) => <CompanyStop key={company.slug} company={company} />)}
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
        .journey-progress { position: fixed; z-index: 9; top: 71px; right: 0; left: 0; height: 1px; background: rgba(255,255,255,.12); pointer-events: none; }
        .journey-progress-fill { position: absolute; inset: 0; background: #fff; transform: scaleX(0); transform-origin: left; will-change: transform; }
        /* Chapter rail — fixed left, numbered caps, orange tick on the
           active chapter. Three stacked copies (white / ink / white) clipped
           along the measured light-band edges (--rail-lt / --rail-lb from
           the scroll probe): each pixel row shows exactly one copy, so
           there is no whole-rail flip, no halo, no dark-on-dark ghost. */
        .journey-rail { position: fixed; z-index: 9; left: clamp(14px,1.8vw,30px); top: 50%; transform: translateY(-50%); --rail-lt: 100%; --rail-lb: 100%; transition: opacity .45s ease, visibility 0s linear 0s; }
        .journey-rail--hidden { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .45s ease, visibility 0s linear .45s; }
        .journey-rail-copy { display: flex; flex-direction: column; gap: 15px; }
        .journey-rail-copy--ink, .journey-rail-copy--dark-bottom { position: absolute; inset: 0; }
        .journey-rail-copy--dark-top { clip-path: inset(0 -14px calc(100% - var(--rail-lt)) -14px); }
        .journey-rail-copy--ink { clip-path: inset(var(--rail-lt) -14px calc(100% - var(--rail-lb)) -14px); }
        .journey-rail-copy--dark-bottom { clip-path: inset(var(--rail-lb) -14px 0 -14px); }
        .journey-rail a { display: flex; align-items: center; gap: 9px; font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.46); text-decoration: none; transition: color .3s ease; }
        .journey-rail-num, .journey-rail-label { transition: opacity .3s ease; }
        /* ticks-only while a light band crosses the rail: 10px caps cannot
           survive the dotted map plate, so labels and numbers step out and
           every chapter keeps a small tick (the phone treatment). */
        .journey-rail--ticks .journey-rail-num, .journey-rail--ticks .journey-rail-label { opacity: 0; }
        .journey-rail--ticks .journey-rail-tick { opacity: .38; transform: none; background: currentColor; }
        .journey-rail--ticks a.is-active .journey-rail-tick { opacity: 1; background: var(--highlight); }
        .journey-rail a:hover { color: rgba(255,255,255,.9); }
        .journey-rail a.is-active { color: #fff; }
        .journey-rail-tick { flex: 0 0 auto; width: 14px; height: 2px; background: var(--highlight); opacity: 0; transform: scaleX(.35); transform-origin: left; transition: opacity .3s ease, transform .3s ease; }
        .journey-rail a.is-active .journey-rail-tick { opacity: 1; transform: none; }
        .journey-rail-num { opacity: .6; }
        .journey-rail-copy--ink a { color: rgba(7,9,14,.5); }
        .journey-rail-copy--ink a:hover { color: rgba(7,9,14,.85); }
        .journey-rail-copy--ink a.is-active { color: var(--wag-ink); }
        /* below 1200px there is no spare left column: numbers + ticks only */
        @media (max-width: 1199px) {
          .journey-rail-label { display: none; }
        }
        /* Company tab strip scrim — full-width page-navy fading to
           transparent: solid through the header + tab rows (0–120px), then
           a ~56px hand-off fade. Exiting stop copy reads 0% before the bar
           zone. Above the copy layer (z 3), below the fixed bars (z 8+). */
        .journey-cotabs-scrim { position: fixed; z-index: 7; inset: 0 0 auto; height: 176px; background: #000835; pointer-events: none; opacity: 0; transition: opacity .4s ease; -webkit-mask-image: linear-gradient(180deg,#000 0%,#000 68%,transparent 100%); mask-image: linear-gradient(180deg,#000 0%,#000 68%,transparent 100%); }
        .journey-cotabs-scrim.is-visible { opacity: 1; }
        /* Company tab rail — under the nav while the company stops are on. */
        .journey-cotabs { position: fixed; z-index: 9; top: 82px; left: 50%; transform: translate(-50%,-8px); display: flex; align-items: center; gap: clamp(1rem,2.6vw,2.3rem); padding: .5rem .25rem; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .4s ease, transform .4s ease, visibility 0s linear .4s; }
        .journey-cotabs.is-visible { opacity: 1; visibility: visible; pointer-events: auto; transform: translate(-50%,0); transition: opacity .4s ease, transform .4s ease, visibility 0s linear 0s; }
        .journey-cotabs button { appearance: none; background: none; border: 0; cursor: pointer; position: relative; padding: .4rem 0 .5rem; margin: 0; color: rgba(255,255,255,.54); font-family: inherit; font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; transition: color .3s ease; }
        .journey-cotabs button::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--highlight); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--ease-reveal); }
        .journey-cotabs button:hover { color: #fff; }
        .journey-cotabs button.is-active { color: #fff; }
        .journey-cotabs button.is-active::after { transform: scaleX(1); }
        .journey-stop { --stop-accent: #1367fe; position: relative; display: flex; align-items: center; padding: 6rem var(--gutter); }
        .journey-stop--end { justify-content: flex-end; }
        .journey-panel { width: min(43rem,48vw); padding: clamp(1.4rem,3vw,2.8rem); background: linear-gradient(105deg,rgba(0,5,31,.96) 0%,rgba(0,8,53,.82) 52%,rgba(0,6,42,.42) 78%,transparent 100%); -webkit-mask-image: linear-gradient(180deg,transparent 0%,#000 9%,#000 91%,transparent 100%); mask-image: linear-gradient(180deg,transparent 0%,#000 9%,#000 91%,transparent 100%); will-change: transform,opacity; }
        .journey-stop--end .journey-panel { background: linear-gradient(255deg,rgba(0,5,31,.96) 0%,rgba(0,8,53,.82) 52%,rgba(0,6,42,.42) 78%,transparent 100%); }
        /* LOCKED company card: one position (lower-left), one width, across
           all five stops. The panel stacks above its signature scene. */
        .journey-stop--kind-company { align-items: flex-end; padding-bottom: clamp(6.5rem,15svh,10.5rem); }
        .journey-stop--kind-company .journey-panel { position: relative; z-index: 1; width: min(36rem,44vw); }
        /* the locked company card steps right of the chapter rail's column
           (placed after the base padding rules so it wins the cascade) */
        @media (min-width: 1200px) {
          .journey-stop--kind-company { padding-left: calc(var(--gutter) + 9.5rem); }
          /* off the screen edge, the panel's dark plate needs a soft left
             fade — the flush hard edge read as a floating rectangle */
          .journey-stop--kind-company .journey-panel { background: linear-gradient(105deg,rgba(0,5,31,0) 0%,rgba(0,5,31,.94) 6%,rgba(0,8,53,.82) 52%,rgba(0,6,42,.42) 78%,transparent 100%); }
        }
        /* Signature scenes — the layer that CHANGES while the card holds. */
        .journey-scene { position: absolute; inset: 0; overflow: hidden; pointer-events: none; will-change: transform,opacity; }
        /* FastTrack: forecourt canopy imagery + blue canopy light-trails */
        .journey-ft-frame { position: absolute; top: 0; right: 0; bottom: 0; width: 76vw; -webkit-mask-image: linear-gradient(97deg,transparent 0%,#000 36%,#000 100%); mask-image: linear-gradient(97deg,transparent 0%,#000 36%,#000 100%); }
        .journey-ft-fade { position: absolute; inset: 0; -webkit-mask-image: linear-gradient(180deg,transparent 0%,#000 14%,#000 80%,transparent 100%); mask-image: linear-gradient(180deg,transparent 0%,#000 14%,#000 80%,transparent 100%); }
        .journey-ft-img { object-fit: cover; object-position: center 38%; opacity: .8; }
        .journey-ft-tint { position: absolute; inset: 0; background: linear-gradient(200deg,rgba(19,103,254,.26) 0%,rgba(0,8,53,.22) 52%,rgba(0,8,53,.72) 100%); }
        .journey-ft-trail { position: absolute; right: -8vw; width: 74vw; border-radius: 999px; }
        .journey-ft-trail--1 { top: 41%; height: 2px; background: linear-gradient(90deg,transparent 4%,rgba(19,103,254,.85) 44%,rgba(140,190,255,.9) 58%,transparent 96%); filter: blur(1px) drop-shadow(0 0 8px rgba(19,103,254,.8)); animation: journeyStreakDrift 24s ease-in-out -6s infinite alternate; }
        .journey-ft-trail--2 { top: 46%; height: 88px; background: linear-gradient(95deg,transparent 10%,rgba(19,103,254,.16) 48%,transparent 90%); filter: blur(26px); animation: journeyStreakDrift 30s ease-in-out infinite alternate-reverse; }
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
           promoted scale. Every other journey heading stays Suisse Intl. */
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
        /* Prominent Explore CTA — same button language as the /companies grid
           and the "Partner With Us" header CTA. Solid in the stop hue with
           readable ink (--stop-ink). Scoped past ".journey-links a" so it
           wins the cascade. The "Visit site" link stays a plain text link. */
        .journey-links a.journey-explore-btn { min-height: 48px; padding: .72rem 1.15rem; background: var(--stop-accent); color: var(--stop-ink,#fff); border-radius: 4px; font-size: .6875rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; text-decoration: none; white-space: nowrap; transition: filter var(--dur-fast) ease, box-shadow var(--dur-fast) ease; }
        .journey-links a.journey-explore-btn:hover, .journey-links a.journey-explore-btn:focus-visible { filter: brightness(1.08); box-shadow: 0 0 22px color-mix(in srgb, var(--stop-accent) 45%, transparent); }
        /* Axxion's pure orange (#FF4200) sits too close to the group's action
           orange; give its Explore button a deeper fill and a hue outline so
           the group CTA stays the one unmistakable pure-signal orange. */
        .journey-links a.journey-explore-btn[data-co="axxion"] { background: color-mix(in srgb, #ff4200 82%, #02040f); border: 1px solid color-mix(in srgb, #ff4200 85%, white); }
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
          /* minimal rail: ticks only, tucked inside the mobile gutter so
             the full-width bottom-sheet cards never collide with it */
          .journey-rail { left: 5px; }
          .journey-rail-copy { gap: 12px; }
          .journey-rail-label, .journey-rail-num { display: none; }
          .journey-rail-tick { width: 9px; opacity: .32; transform: none; background: currentColor; }
          .journey-rail a.is-active .journey-rail-tick { width: 14px; opacity: 1; background: var(--highlight); }
          /* phone bar geometry: 64px header + tab row ≈ 100px, then the
             56px hand-off fade */
          .journey-cotabs-scrim { height: 156px; -webkit-mask-image: linear-gradient(180deg,#000 0%,#000 64%,transparent 100%); mask-image: linear-gradient(180deg,#000 0%,#000 64%,transparent 100%); }
          .journey-cotabs { top: 66px; left: 0; right: 0; transform: translateY(-8px); justify-content: center; gap: .9rem; padding-inline: .75rem; overflow-x: auto; scrollbar-width: none; }
          .journey-cotabs.is-visible { transform: translateY(0); }
          .journey-cotabs::-webkit-scrollbar { display: none; }
          .journey-cotabs button { font-size: 9px; letter-spacing: .13em; white-space: nowrap; }
          .journey-static-image { object-position: 65% center; }.journey-stop,.journey-stop--end { align-items: flex-end; justify-content: stretch; padding: 5rem 0 0; }
          .journey-stop:first-child { min-height: 100svh !important; }
          .journey-panel,.journey-stop--end .journey-panel,.journey-stop--kind-company .journey-panel { width: 100%; padding: 5.5rem var(--gutter) max(1.5rem,env(safe-area-inset-bottom)); background: linear-gradient(0deg,rgba(0,5,31,.98),rgba(0,8,53,.84) 62%,transparent); -webkit-mask-image: none; mask-image: none; }
          /* Scenes move into the free upper half of the mobile stop; the
             bottom-sheet card owns the lower half unchanged. */
          /* the phone crop is tall and narrow: hold the frame to the free
             upper half and aim at the pump bays (right of the image centre) */
          .journey-ft-frame { width: 100%; bottom: auto; height: 64%; -webkit-mask-image: none; mask-image: none; }
          .journey-ft-img { object-position: 66% center; }
          .journey-ft-trail { right: -14vw; width: 128vw; }
          .journey-ft-trail--1 { top: 30%; }
          .journey-ft-trail--2 { top: 34%; }
          .journey-panel h2 { font-size: clamp(2.45rem,12vw,4.6rem); }
          /* first stop is 100svh on mobile: park the cue at the true bottom
             and clear room for it under the statement. The anchor statement
             steps down so "Automotive." holds as one word on a 390px screen. */
          .journey-panel h1 { max-width: none; font-size: clamp(3rem,14.2vw,5.5rem); }
          .journey-stop--kind-hero .journey-panel { width: 100%; padding-bottom: 6.75rem; }
          .journey-scroll-cue { bottom: 1.6rem; gap: .55rem; }
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
          /* scenes hold still and stay visible (no GSAP in this mode) */
          .journey-scene { will-change: auto; opacity: 1 !important; transform: none !important; }
          .journey-ft-trail { animation: none; }
        }
        html.webgl-unavailable .journey-webgl { display: none !important; }
        html.webgl-unavailable .journey-static-frame { opacity: 1 !important; transform: none !important; }
      `}</style>
    </main>
  );
}
