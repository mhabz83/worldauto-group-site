"use client";

/**
 * S8 — "The Group in Numbers" on the recovered careers stacked-sticky-cards
 * machine: four overlapping sticky wrappers (400/300/200/100svh, margin-tops
 * 0/100/200/300svh), progress = parallax 10-0 → 110-100 clamped,
 * activeIndex = floor(progress · 3), and the exact --0..--4 class state table
 * (initial states [1,0,0,0]; N = i > active ? 1 : active − i + 1).
 */

import { useEffect, useRef } from "react";
import { gsap, waypointTrigger } from "./engine";
import { FlickerTitle } from "./reveal";

/* Support copy is deliberately sparse on the merged page: the heritage beats
   and the story opener already carry the group narrative, and no sentence may
   appear twice. Only the revenue card keeps its (unique) credit line. */
const cards: { stat: string; short: boolean; label: string; support?: string }[] = [
  {
    stat: "1994",
    short: true,
    label: "Founded, Abu Dhabi",
  },
  {
    stat: "~USD 650M",
    short: false,
    label: "Annual group revenue",
    support: "Group figures include all Skelmore operations.",
  },
  {
    stat: "~4,000",
    short: false,
    label: "People across the group",
  },
  {
    stat: "UAE · NA",
    short: false,
    label: "Two operating regions",
  },
];

const HEIGHTS = [400, 300, 200, 100];

export function CareersCards() {
  const stickyGridRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statesRef = useRef<number[]>(cards.map((_, i) => (i === 0 ? 1 : 0)));
  const activeRef = useRef(0);

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

        /* careerCardList controller — verbatim update logic */
        waypointTrigger({
          el: stickyGridRef.current,
          measure: stickyGridRef.current,
          waypoints: [
            { a: 10, b: 0 },
            { a: 110, b: 100 },
          ],
          onProgress: (p) => {
            const active = Math.floor(p * (cards.length - 1));
            if (activeRef.current === active) return;
            activeRef.current = active;
            const states = statesRef.current;
            for (let i = 0; i < cards.length; i++) {
              const next = i > active ? 1 : active - i + 1;
              if (states[i] !== next) {
                const el = cardRefs.current[i];
                el?.classList.remove(`ax-career-card--${states[i]}`);
                el?.classList.add(`ax-career-card--${next}`);
                states[i] = next;
              }
            }
          },
        });

        /* background drift — imageMoveBackgroundAlt (md-up only) */
        if (md) {
          waypointTrigger({
            el: bgRef.current,
            measure: sectionRef.current,
            waypoints: () => {
              const sectionH =
                sectionRef.current?.getBoundingClientRect().height ?? 1;
              const imgH = bgRef.current?.getBoundingClientRect().height ?? 0;
              const end = -((sectionH - imgH) / sectionH) * 100;
              return [
                { a: 0, b: 0, transform: "translateY(0%)" },
                { a: 100, b: 100, transform: `translateY(${end}%)` },
              ];
            },
          });
        }
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      id="numbers"
      ref={sectionRef}
      data-ax-theme="dark"
      className="ax-section ax-careers"
    >
      <div className="ax-careers-bg" aria-hidden="true">
        <img ref={bgRef} src="/hero/suv-neon.jpg" alt="" draggable={false} />
      </div>
      <div className="ax-container ax-careers-inner">
        <div className="ax-grid ax-careers-top">
          <FlickerTitle
            as="h2"
            className="ax-h1"
            reveal="title"
            segments={[
              "The Group",
              "\n",
              { text: "in Numbers", className: "ax-accent-b" },
            ]}
          />
          {/* the credit line lives on the revenue card — once on the page */}
        </div>

        <div ref={stickyGridRef} className="ax-careers-sticky">
          {cards.map((c, i) => (
            <div
              key={c.stat}
              className="ax-cc-sticky"
              style={{ height: `${HEIGHTS[i]}svh`, marginTop: `${i * 100}svh` }}
            >
              <div className="ax-cc-layer">
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`ax-career-card ax-career-card--${i === 0 ? 1 : 0}`}
                >
                  <div className="ax-grid ax-cc-layout">
                    <div className="ax-cc-chip-col">
                      <p
                        className={
                          "ax-cc-chip " + (c.short ? "ax-cc-chip--short" : "ax-cc-chip--long")
                        }
                      >
                        <span>{c.stat}</span>
                      </p>
                    </div>
                    <h3 className="ax-h3 ax-cc-title">{c.label}</h3>
                    {c.support && <p className="ax-t1 ax-cc-body">{c.support}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The "Build With The Group." CTA that used to close this section
            now lives in StoryTail's PartnerClose, after the companies recap —
            one partner CTA on the whole merged page. */}
      </div>
    </section>
  );
}
