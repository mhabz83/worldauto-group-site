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
import { approach } from "@/content/home";
import { companies } from "@/content/site";
import { journeyContent } from "@/components/hero/journeyContent";
import { ScrollTrigger } from "./engine";
import { FlickerText, FlickerTitle, GlitchLabel, useRevealManager } from "./reveal";
import { GlowSvg } from "./svgs";
import { TeamCarousel, CompaniesCarousel } from "./Carousels";
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
  return (
    <section
      id="foresight"
      data-ax-theme="dark"
      data-nav-section="group"
      className="ax-section ax-approach"
    >
      <GlowSvg className="ax-approach-glow" />
      <div className="ax-container ax-approach-inner">
        <div className="ax-approach-head">
          <FlickerTitle
            as="p"
            className="ax-t2 ax-orange ax-approach-eyebrow"
            reveal="title"
            segments={[approach.eyebrow]}
          />
          <FlickerTitle
            as="h2"
            className="ax-h2 ax-approach-heading"
            reveal="title"
            segments={[approach.heading]}
          />
          <FlickerText
            as="p"
            className="ax-lead ax-approach-lead"
            reveal="text"
            segments={[approach.lead]}
          />
        </div>

        <div className="ax-approach-grid">
          <div className="ax-approach-graphic" data-about-reveal="fade-in">
            <div className="ax-cap-video-frame">
              <video
                className="ax-cap-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/video/automotive-dna-poster.webp"
                aria-hidden="true"
              >
                <source src="/video/automotive-dna.mp4" type="video/mp4" />
              </video>
              <img
                className="ax-cap-poster"
                src="/video/automotive-dna-poster.webp"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
          <ol className="ax-approach-list">
            {approach.capabilities.map((c, i) => (
              <li key={c.title} className="ax-approach-item" data-about-reveal="fade-in">
                <span className="ax-approach-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="ax-approach-copy">
                  <h3 className="ax-approach-cap-title">{c.title}</h3>
                  <p className="ax-approach-cap-body">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* commitment collage                                                  */
/* ------------------------------------------------------------------ */

function CommitmentSection() {
  return (
    <section
      id="commitment"
      data-ax-theme="dark"
      data-nav-section="group"
      className="ax-section ax-commitment"
    >
      {/* full-bleed world map plate: pins are baked into the artwork */}
      <div className="ax-world-map">
        <img
          src="/about/world-map.webp"
          alt="World map highlighting the United States, Canada, Saudi Arabia, the United Arab Emirates and Oman"
          width={2688}
          height={1520}
          loading="lazy"
          draggable={false}
        />
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
      <TeamCarousel />
      <CareersCards />
      <CompaniesCarousel />
      <PartnerClose />
      <Endcap />
    </div>
  );
}
