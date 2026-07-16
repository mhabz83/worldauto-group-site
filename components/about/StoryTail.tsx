"use client";

/**
 * StoryTail — the Madar-machine story sections of the merged homepage.
 * The WebGL journey (LandingJourney stops 1–7) hands off to this tail in
 * normal flow: S3 "Part of Skelmore" (crowned "One Operator, Many Engines."),
 * S2 foresight (glow + orbital drift + glass card), S4 commitment (3-layer
 * counter-drift collage + crosshair pins), S6 pinned values → timeline,
 * S5 leadership carousel, S8 stacked number cards, S7 companies recap
 * carousel + synced card, partner close, footer endcap.
 *
 * Engine: native scroll + GSAP ScrollTrigger reproducing the recovered
 * waypoint semantics (see engine.ts). prefers-reduced-motion collapses every
 * pin to normal flow. The former /about page and its own hero, header and
 * breadcrumbs are retired — the journey Header owns the whole merged page.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import { group, footer as footerContent } from "@/content/site";
import { companiesSection, model } from "@/content/home";
import { companies } from "@/content/site";
import { journeyContent } from "@/components/hero/journeyContent";
import { gsap, ScrollTrigger, SCRUB_SMOOTH, waypointTrigger } from "./engine";
import { FlickerText, FlickerTitle, GlitchLabel, useRevealManager } from "./reveal";
import { GlowSvg, OrbitalSvg, PinBorder } from "./svgs";
import { LeadershipCarousel, CompaniesCarousel } from "./Carousels";
import { ValuesTimeline } from "./ValuesTimeline";
import { CareersCards } from "./CareersCards";

/* ------------------------------------------------------------------ */
/* story opener — the about S3 Skelmore section, crowned with the      */
/* retired about hero's display headline (ui-light)                    */
/* ------------------------------------------------------------------ */

function StoryOpener() {
  return (
    <section
      id="story"
      data-ax-theme="light"
      data-nav-section="group"
      className="ax-section ax-light"
    >
      <div className="ax-container ax-giants-inner">
        <div className="ax-grid">
          <FlickerTitle
            as="h2"
            className="ax-h1 ax-giants-title"
            reveal="title"
            segments={[
              "One Operator,",
              "\n",
              { text: "Many Engines.", className: "ax-accent-b" },
            ]}
          />
          <span className="ax-hairline ax-giants-rule" />
          <p className="ax-t2 ax-giants-kicker" data-about-reveal="fade-in">
            Part of Skelmore
          </p>
          <p className="ax-lead ax-giants-body" data-about-reveal="fade-in">
            {footerContent.blurb}
          </p>
          {/* Group facts that the stacked numbers cards do NOT repeat. */}
          <div className="ax-giants-cards">
            <div className="ax-fact-card" data-about-reveal="fade-in">
              <span className="ax-fact-card-value">Est. 1994</span>
              <span className="ax-fact-card-label">Abu Dhabi</span>
            </div>
            <div className="ax-fact-card" data-about-reveal="fade-in">
              <span className="ax-fact-card-value">ADGM</span>
              <span className="ax-fact-card-label">{group.hq}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* foresight → the model positioning                                   */
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
      data-nav-section="group"
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
/* commitment collage                                                  */
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
      data-nav-section="group"
      className="ax-section ax-commitment"
    >
      <div ref={bgRef} className="ax-commitment-layer ax-commitment-bg" aria-hidden="true">
        {/* No photo here by design: the grid + pins own the section. A soft
            radial field keeps the parallax layer alive. */}
        <div className="ax-commitment-field" />
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
            {/* companiesSection.intro — the journey hero already states the
                "five companies, one standard" line, so this collage carries a
                different verified group statement instead of repeating it. */}
            <FlickerText
              as="h2"
              className="ax-h3"
              reveal="text"
              segments={[companiesSection.intro]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* partner close — the about S8 bottom CTA block as its own section    */
/* (one partner CTA on the whole merged page)                          */
/* ------------------------------------------------------------------ */

function PartnerClose() {
  return (
    <section
      id="partner"
      data-ax-theme="dark"
      data-nav-section="partner"
      className="ax-section ax-partner"
    >
      <div className="ax-container">
        <div className="ax-grid ax-careers-bottom ax-partner-inner">
          <FlickerTitle
            as="h2"
            className="ax-h2 ax-cta-title"
            reveal="title"
            segments={["Build With", "\n", "The Group."]}
          />
          <span className="ax-hairline ax-cta-rule" />
          <p className="ax-t1 ax-cta-body" data-about-reveal="fade-in">
            {journeyContent.partner.body}
          </p>
          <div className="ax-cta-action" data-about-reveal="fade-in">
            <Link
              href="/contact"
              className="ax-btn-primary"
              data-ax-glitch
              aria-label={journeyContent.partner.cta}
            >
              <GlitchLabel text={journeyContent.partner.cta} /> →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* footer endcap — the single footer of the merged page                */
/* ------------------------------------------------------------------ */

function Endcap() {
  return (
    <section data-ax-theme="dark" className="ax-section ax-endcap">
      <div className="ax-container">
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

export function StoryTail() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealManager(rootRef);
  useGlitchHover();

  useEffect(() => {
    /* Tail waypoints are measured from absolute page positions, so re-measure
       once media/fonts settle and again when everything has loaded — after
       the journey wrapper's height is final. */
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div ref={rootRef} className="ax">
      <StoryOpener />
      <ForesightSection />
      <CommitmentSection />
      <ValuesTimeline />
      <LeadershipCarousel />
      <CareersCards />
      <CompaniesCarousel />
      <PartnerClose />
      <Endcap />
    </div>
  );
}
