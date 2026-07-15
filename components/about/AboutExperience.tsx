"use client";

/**
 * /about — the recovered reference machine, re-skinned with WAG brand and
 * verified content. Section-by-section port of the reference /about-us page:
 * S1 hero (imageMoveBackground parallax + scrim), S2 foresight (glow + orbital
 * drift + glass card), S3 giants → Part of Skelmore (ui-light), S4 commitment
 * (3-layer counter-drift collage + crosshair pins), S5 leadership carousel,
 * S6 pinned values → timeline, S7 companies carousel + synced card,
 * S8 stacked number cards, S9 breadcrumbs + footer.
 *
 * Engine: native scroll + GSAP ScrollTrigger reproducing the recovered
 * waypoint semantics (see engine.ts). prefers-reduced-motion collapses every
 * pin to normal flow — a deliberate improvement over the reference.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { companies, group, nav, footer as footerContent } from "@/content/site";
import { model } from "@/content/home";
import {
  gsap,
  ScrollTrigger,
  SCRUB_SMOOTH,
  waypointTrigger,
} from "./engine";
import { FlickerText, FlickerTitle, useRevealManager } from "./reveal";
import { ArrowDown, Chevron, GlowSvg, OrbitalSvg, PinBorder } from "./svgs";
import { LeadershipCarousel, CompaniesCarousel } from "./Carousels";
import { ValuesTimeline } from "./ValuesTimeline";
import { CareersCards } from "./CareersCards";

/* ------------------------------------------------------------------ */
/* header — page-local version of the journey header: wordmark, nav,   */
/* CTA, 2px progress line, theme flip per section                      */
/* ------------------------------------------------------------------ */

function AboutHeader() {
  const [onLight, setOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => header.style.setProperty("--p", String(self.progress)),
      onRefresh: (self) => header.style.setProperty("--p", String(self.progress)),
    });

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ax-theme]"),
    );
    let raf = 0;
    const check = () => {
      const probe = 40;
      let light = false;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) {
          light = s.dataset.axTheme === "light";
          break;
        }
      }
      setOnLight(light);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      st.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={"ax-header" + (onLight && !menuOpen ? " ax-header--light" : "")}
      >
        <Link href="/" className="ax-header-wordmark" aria-label="WorldAuto Group home">
          <strong>WorldAuto</strong> <span>Group</span>
        </Link>
        <nav className="ax-header-nav" aria-label="Site navigation">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Link href={nav.cta.href} className="ax-header-cta">
            {nav.cta.label}
          </Link>
          <button
            type="button"
            className="ax-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="ax-mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
        <span className="ax-header-progress" aria-hidden="true" />
      </header>
      <nav
        id="ax-mobile-menu"
        className={"ax-mobile-menu" + (menuOpen ? " is-open" : "")}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {nav.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* S1 — hero                                                           */
/* ------------------------------------------------------------------ */

const heroLead = `${group.name} is the automotive arm of ${group.parent.name}, a private group founded in ${group.parent.founded}. We build and run automotive operations across the UAE and North America, then productize what works.`;

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        md: "(min-width: 768px)",
        sm: "(max-width: 767px)",
      },
      (ctx) => {
        const { motion, md } = ctx.conditions as { motion: boolean; md: boolean };
        if (!motion) return;
        if (md) {
          /* imageMoveBackground: +20% → −20%, clamped, across full visibility */
          waypointTrigger({
            el: imgRef.current,
            measure: sectionRef.current,
            scrub: SCRUB_SMOOTH,
            waypoints: [
              { a: 100, b: 0, transform: "translateY(20%)" },
              { a: 0, b: 100, transform: "translateY(-20%)" },
            ],
          });
        } else {
          /* mobile: pinned hero drifts up 20svh while the next section slides over */
          waypointTrigger({
            el: stickyRef.current,
            measure: sectionRef.current,
            scrub: SCRUB_SMOOTH,
            waypoints: [
              { a: 0, b: 0, transform: "translateY(0svh)" },
              { a: 0, b: 100, transform: "translateY(-20svh)" },
            ],
          });
        }
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-ax-theme="dark"
      className="ax-section ax-hero"
    >
      <div ref={stickyRef} className="ax-hero-sticky">
        <div className="ax-hero-media" aria-hidden="true">
          <img
            ref={imgRef}
            src="/hero/suv-neon.jpg"
            alt=""
            fetchPriority="high"
            draggable={false}
          />
        </div>
        <div className="ax-hero-darken" aria-hidden="true" />
        <div className="ax-container ax-hero-content">
          <p className="ax-hero-label ax-t2">The Group</p>
          <span className="ax-hairline" />
          <div className="ax-hero-row">
            <h1 className="ax-h1 ax-hero-title">
              One Operator,
              <br />
              <span className="ax-orange">Many Engines.</span>
            </h1>
            <div className="ax-hero-side">
              <p className="ax-lead">{heroLead}</p>
              <a
                className="ax-btn-square"
                href="#foresight"
                aria-label="Scroll down to the model"
              >
                <ArrowDown />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S2 — foresight → the model positioning                              */
/* ------------------------------------------------------------------ */

function ForesightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        md: "(min-width: 768px)",
      },
      (ctx) => {
        const { motion, md } = ctx.conditions as { motion: boolean; md: boolean };
        if (!motion || !md) return;
        /* orbital drift: −5vw → +5vw across section visibility */
        waypointTrigger({
          el: svgWrapRef.current,
          measure: sectionRef.current,
          waypoints: [
            { a: 100, b: 0, transform: "translateY(-5vw)" },
            { a: 0, b: 100, transform: "translateY(5vw)" },
          ],
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      id="foresight"
      ref={sectionRef}
      data-ax-theme="dark"
      className="ax-section ax-foresight"
    >
      <GlowSvg className="ax-foresight-glow" />
      <div className="ax-container ax-foresight-inner">
        <div className="ax-grid">
          <div className="ax-foresight-head">
            <FlickerTitle
              as="h2"
              className="ax-t2 ax-orange"
              reveal="title"
              segments={["The Model"]}
            />
            <span className="ax-hairline" style={{ margin: "0.9rem 0 1.5rem" }} />
            <FlickerText
              as="p"
              className="ax-h3"
              reveal="text"
              segments={["Automotive, run like infrastructure."]}
            />
          </div>
          <div className="ax-foresight-svg-col">
            <div ref={svgWrapRef} className="ax-foresight-svg">
              <OrbitalSvg />
            </div>
          </div>
          <div className="ax-foresight-card-col">
            <div className="ax-glass-card" data-about-reveal="flicker-in">
              <p className="ax-lead">{model.intro}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S3 — giants → Part of Skelmore (ui-light, text cards, no logos)     */
/* ------------------------------------------------------------------ */

function SkelmoreSection() {
  return (
    <section id="skelmore" data-ax-theme="light" className="ax-section ax-light">
      <div className="ax-container ax-giants-inner">
        <div className="ax-grid">
          <FlickerTitle
            as="h2"
            className="ax-h1 ax-giants-title"
            reveal="title"
            segments={["Part of", "\n", { text: "Skelmore", className: "ax-accent-b" }]}
          />
          <span className="ax-hairline ax-giants-rule" />
          <p className="ax-t2 ax-giants-kicker" data-about-reveal="fade-in">
            A Skelmore company
          </p>
          <p className="ax-lead ax-giants-body" data-about-reveal="fade-in">
            {footerContent.blurb}
          </p>
          <div className="ax-giants-cards">
            <div className="ax-fact-card" data-about-reveal="fade-in">
              <span className="ax-fact-card-value">1994</span>
              <span className="ax-fact-card-label">Founded, Abu Dhabi</span>
            </div>
            <div className="ax-fact-card" data-about-reveal="fade-in">
              <span className="ax-fact-card-value">UAE · NA</span>
              <span className="ax-fact-card-label">Two operating regions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S4 — commitment collage                                             */
/* ------------------------------------------------------------------ */

const commitmentPins = [
  { x: "8.4%", y: "29.23%", mx: "13.2%", my: "16.7%", label: "Est. 1994" },
  { x: "33.35%", y: "35.45%", mx: "81.9%", my: "16.6%", label: "32 centres" },
  { x: "25.05%", y: "60.45%", label: "~4,000 people", hideMobile: true },
  { x: "58.3%", y: "60.45%", label: "UAE · NA", hideMobile: true },
];

function CommitmentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gridLayerRef = useRef<HTMLDivElement>(null);
  const gridImgRef = useRef<HTMLImageElement>(null);
  const stmtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        md: "(min-width: 768px)",
      },
      (ctx) => {
        const { motion, md } = ctx.conditions as { motion: boolean; md: boolean };
        if (!motion) return;
        const measure = sectionRef.current;
        /* layer 1 + 2: −20vw → +20vw deep parallax (all widths, mobileSmooth) */
        for (const el of [bgRef.current, gridLayerRef.current]) {
          waypointTrigger({
            el,
            measure,
            scrub: SCRUB_SMOOTH,
            waypoints: [
              { a: 100, b: 0, transform: "translateY(-20vw)" },
              { a: 0, b: 100, transform: "translateY(20vw)" },
            ],
          });
        }
        /* inner grid picture: +20svh → −20svh counter-drift */
        waypointTrigger({
          el: gridImgRef.current,
          measure,
          scrub: SCRUB_SMOOTH,
          waypoints: [
            { a: 100, b: 0, transform: "translateY(20svh)" },
            { a: 0, b: 100, transform: "translateY(-20svh)" },
          ],
        });
        /* statement drift (md-up) */
        if (md) {
          waypointTrigger({
            el: stmtRef.current,
            measure,
            waypoints: [
              { a: 100, b: 0, transform: "translateY(20svh)" },
              { a: 0, b: 100, transform: "translateY(-20svh)" },
            ],
          });
        }
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      id="commitment"
      ref={sectionRef}
      data-ax-theme="dark"
      className="ax-section ax-commitment"
    >
      <div ref={bgRef} className="ax-commitment-layer ax-commitment-bg" aria-hidden="true">
        <img src="/hero/suv-neon.jpg" alt="" draggable={false} />
      </div>
      <div
        ref={gridLayerRef}
        className="ax-commitment-layer ax-commitment-gridlayer ax-container"
      >
        <div className="ax-commitment-grid">
          <img
            ref={gridImgRef}
            src="/about/grid.svg"
            alt=""
            width={1652}
            height={1895}
            draggable={false}
          />
          {commitmentPins.map((pin) => (
            <div
              key={pin.label}
              className={
                "ax-pin ax-pin--target ax-pin--visible ax-pin--black" +
                (pin.hideMobile ? " ax-hide-sm" : "")
              }
              style={
                {
                  "--pin-x": pin.x,
                  "--pin-y": pin.y,
                  "--pin-mx": pin.mx,
                  "--pin-my": pin.my,
                } as React.CSSProperties
              }
            >
              <PinBorder />
              <div className="ax-pin__line-x" />
              <div className="ax-pin__line-y" />
              <div className="ax-pin__background" />
              <div className="ax-pin__dot" />
              <span className="ax-pin__label">{pin.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ax-commitment-layer ax-container ax-commitment-content">
        <div className="ax-grid">
          <div ref={stmtRef} className="ax-commitment-statement">
            <FlickerText
              as="h2"
              className="ax-h3"
              reveal="text"
              segments={[
                "Five operating companies across the UAE and North America. One group standard for service, data and retail.",
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S9 — breadcrumbs + footer                                           */
/* ------------------------------------------------------------------ */

function Endcap() {
  return (
    <section data-ax-theme="dark" className="ax-section ax-endcap">
      <div className="ax-container">
        <ol className="ax-breadcrumbs">
          <li>
            <Link href="/">Homepage</Link>
          </li>
          <li aria-hidden="true">
            <Chevron />
          </li>
          <li>
            <span className="ax-crumb-current" aria-current="page">
              The Group
            </span>
          </li>
        </ol>
        <span className="ax-hairline" />
        <footer className="ax-footer">
          <nav className="ax-footer-companies" aria-label="Group companies">
            {companies.map((c) => (
              <Link key={c.slug} href={`/companies/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </nav>
          <p>A Skelmore company · © 2026</p>
        </footer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* glitch hover for the primary CTA labels (btn--glitch port)          */
/* ------------------------------------------------------------------ */

function useGlitchHover() {
  useEffect(() => {
    const root = document.querySelector(".ax");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = new Set<number>();
    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.querySelectorAll<HTMLElement>(".char").forEach((ch) => {
        ch.style.setProperty("--glitch-delay", `${Math.round(Math.random() * 200)}ms`);
      });
      target.classList.add("ax-glitch-run");
      const t = window.setTimeout(() => target.classList.remove("ax-glitch-run"), 450);
      timers.add(t);
    };
    const els = root.querySelectorAll<HTMLElement>("[data-ax-glitch]");
    els.forEach((el) => el.addEventListener("mouseenter", onEnter));
    return () => {
      els.forEach((el) => el.removeEventListener("mouseenter", onEnter));
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/* assembly                                                            */
/* ------------------------------------------------------------------ */

export function AboutExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealManager(rootRef);
  useGlitchHover();

  useEffect(() => {
    /* the pinned sections change layout as media/fonts settle */
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={rootRef} className="ax">
      <AboutHeader />
      <main id="main">
        <HeroSection />
        <ForesightSection />
        <SkelmoreSection />
        <CommitmentSection />
        <LeadershipCarousel />
        <ValuesTimeline />
        <CompaniesCarousel />
        <CareersCards />
        <Endcap />
      </main>
    </div>
  );
}
