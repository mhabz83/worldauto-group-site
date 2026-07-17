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
import { model } from "@/content/home";
import { companies } from "@/content/site";
import { journeyContent } from "@/components/hero/journeyContent";
import { gsap, ScrollTrigger, waypointTrigger, SCRUB_SMOOTH } from "./engine";
import { FlickerText, FlickerTitle, GlitchLabel, useRevealManager } from "./reveal";
import { GlowSvg, OrbitalSvg } from "./svgs";
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
  const sectionRef = useRef<HTMLElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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

        /* scroll assembly: the system draws itself in stages as the section
           scrolls through — rings, then orbit arcs, then the feed lines into
           the hub, then the 12 nodes dock in sequence around the orbit.
           `?modelfx=quiet` disables the post-assembly energy pulses. */
        const svg = svgRef.current;
        if (!svg) return;

        const rings = Array.from(svg.querySelectorAll<SVGGeometryElement>(".ax-orb-ring"));
        const arcs = Array.from(svg.querySelectorAll<SVGGeometryElement>(".ax-orb-arc"));
        const flows = Array.from(svg.querySelectorAll<SVGGeometryElement>(".ax-orb-flow"));
        const dots = Array.from(svg.querySelectorAll<SVGCircleElement>(".ax-orb-dot"));

        const strokes = [...rings, ...arcs, ...flows].map((el) => {
          const len = el.getTotalLength();
          el.style.strokeDasharray = String(len);
          el.style.strokeDashoffset = String(len);
          return { el, len };
        });
        const ringS = strokes.slice(0, rings.length);
        const arcS = strokes.slice(rings.length, rings.length + arcs.length);
        const flowS = strokes.slice(rings.length + arcs.length);

        /* nodes dock in orbit order (sorted by angle around the hub) */
        const dotSeq = dots
          .map((el) => ({
            el,
            ang: Math.atan2(
              Number(el.getAttribute("cy")) - 470,
              Number(el.getAttribute("cx")) - 710,
            ),
          }))
          .sort((m, n) => m.ang - n.ang)
          .map((d) => d.el);
        dotSeq.forEach((el) => {
          el.style.transformBox = "fill-box";
          el.style.transformOrigin = "center";
          el.style.transform = "scale(0)";
          el.style.opacity = "0";
        });

        /* post-assembly energy pulses: cloned paths carrying a moving dash */
        const quiet =
          new URLSearchParams(window.location.search).get("modelfx") === "quiet";
        const pulses: SVGGeometryElement[] = [];
        if (!quiet) {
          const sources: Array<[SVGGeometryElement | undefined, string, number]> = [
            [rings[2], "#42D7FF", 14], // outer ring, blue current
            [arcs[5], "#FF9E7A", 9], // large perspective orbit
            [arcs[4], "#FF9E7A", 7], // small perspective orbit
            [flows[1], "#FF9E7A", 5], // mid feed line into the hub
          ];
          for (const [src, color, dur] of sources) {
            if (!src) continue;
            const clone = src.cloneNode(false) as SVGGeometryElement;
            clone.removeAttribute("class");
            clone.setAttribute("stroke", color);
            clone.setAttribute("opacity", "1");
            clone.style.opacity = "0";
            src.parentNode?.insertBefore(clone, src.nextSibling);
            const len = clone.getTotalLength();
            const head = Math.min(60, len * 0.08);
            clone.style.strokeDasharray = `${head} ${len - head}`;
            clone.style.strokeDashoffset = "0";
            gsap.to(clone, {
              strokeDashoffset: -len,
              duration: dur,
              ease: "none",
              repeat: -1,
            });
            pulses.push(clone);
          }
        }

        const seg = (p: number, a: number, b: number) =>
          Math.min(1, Math.max(0, (p - a) / (b - a)));
        const drawTo = (s: { el: SVGGeometryElement; len: number }, t: number) => {
          s.el.style.strokeDashoffset = String(s.len * (1 - t));
        };

        /* windows sized so the system is fully assembled by p≈0.5 — the point
           where the (taller-than-viewport) section fills the screen */
        const draw = (p: number) => {
          ringS.forEach((s, i) => drawTo(s, seg(p, 0.02 + i * 0.04, 0.2 + i * 0.04)));
          arcS.forEach((s, i) => drawTo(s, seg(p, 0.12 + i * 0.025, 0.32 + i * 0.025)));
          flowS.forEach((s, i) => drawTo(s, seg(p, 0.22 + i * 0.025, 0.4 + i * 0.025)));
          dotSeq.forEach((el, i) => {
            const t = seg(p, 0.3 + i * 0.012, 0.35 + i * 0.012);
            const e = t * t * (3 - 2 * t); // smoothstep pop
            el.style.transform = `scale(${e})`;
            el.style.opacity = String(e);
          });
          const glow = seg(p, 0.4, 0.5) * 0.85;
          pulses.forEach((el) => {
            el.style.opacity = String(glow);
          });
        };

        waypointTrigger({
          el: null,
          measure: sectionRef.current,
          waypoints: [
            { a: 100, b: 0 },
            { a: 0, b: 100 },
          ],
          scrub: SCRUB_SMOOTH,
          onProgress: draw,
        });

        return () => {
          pulses.forEach((el) => el.remove());
          strokes.forEach(({ el }) => {
            el.style.strokeDasharray = "";
            el.style.strokeDashoffset = "";
          });
          dotSeq.forEach((el) => {
            el.style.transform = "";
            el.style.opacity = "";
            el.style.transformBox = "";
            el.style.transformOrigin = "";
          });
        };
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
              <OrbitalSvg svgRef={svgRef} />
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
