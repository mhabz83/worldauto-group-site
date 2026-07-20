"use client";

/**
 * S7 Companies carousel.
 *
 * keen-slider (the exact library the reference embedded), configured per the
 * recovered spec: loop, 1000 ms cubic-bezier(.6,0,.1,1) next/prev, rubberband
 * drag, arrows firing on pointerdown, edge-fade classes, native scroll-snap
 * fallback below md and under reduced motion. Reproduces the recovered
 * `imageScale` effect verbatim. (The team chapter is now the static duotone
 * band in TeamBand.tsx — the recovered lineup carousel is retired.)
 */

import Link from "next/link";
import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import KeenSlider, { KeenSliderInstance, KeenSliderOptions } from "keen-slider";
import { companies } from "@/content/site";
import { stopAccents } from "@/components/hero/journeyContent";
import {
  CAROUSEL_DURATION,
  easeCarousel,
  gsap,
  mapLinear,
  waypointTrigger,
} from "./engine";
import { FlickerText, FlickerTitle } from "./reveal";
import { ArrowLeft, ArrowRight } from "./svgs";

/* ------------------------------------------------------------------ */
/* shared: keen lifecycle across the md breakpoint                      */
/* ------------------------------------------------------------------ */

function useKeen(
  listRef: React.RefObject<HTMLUListElement | null>,
  options: (helpers: { onCreated: () => void }) => KeenSliderOptions,
) {
  const sliderRef = useRef<KeenSliderInstance | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const destroy = () => {
      if (!sliderRef.current) return;
      sliderRef.current.destroy();
      sliderRef.current = null;
      setReady(false);
      list.querySelectorAll<HTMLElement>(".ax-slide").forEach((el) => {
        el.style.minWidth = "";
        el.style.maxWidth = "";
        el.style.transform = "";
        el.style.zIndex = "";
      });
      list
        .querySelectorAll<HTMLElement>(".ax-company-panel-inner")
        .forEach((el) => {
          el.style.transform = "";
        });
    };
    const sync = () => {
      if (mq.matches && !reduce.matches) {
        if (!sliderRef.current) {
          sliderRef.current = new KeenSlider(
            list,
            options({ onCreated: () => setReady(true) }),
          );
        }
      } else {
        destroy();
      }
    };
    sync();
    mq.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sliderRef, ready };
}

/* arrows fire on pointerdown — the recovered mousedown behaviour */
function NavButton({
  onTrigger,
  label,
  children,
}: {
  onTrigger: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="ax-btn-square"
      aria-label={label}
      onPointerDown={(e: ReactPointerEvent) => {
        e.preventDefault();
        onTrigger();
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTrigger();
        }
      }}
    >
      {children}
    </button>
  );
}

/* native fallback scrolling for the sm-down scroller */
function scrollByItem(list: HTMLElement | null, dir: 1 | -1) {
  if (!list) return;
  const item = list.querySelector<HTMLElement>(".ax-slide");
  if (!item) return;
  list.scrollBy({ left: dir * (item.offsetWidth + 10), behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/* S7 — Five companies, one standard (recovered team carousel)          */
/* ------------------------------------------------------------------ */

const IMAGE_SCALE_MIN = 0.82; /* neighbors sit clearly "further back" */

export function CompaniesCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const applyImageScale = useCallback((s: KeenSliderInstance) => {
    const details = s.track.details;
    if (!details) return;
    s.slides.forEach((slideEl, i) => {
      const r = -details.slides[i].distance;
      const scale = mapLinear(Math.abs(r), 0, 1, 1, IMAGE_SCALE_MIN, true);
      const x = mapLinear(r, -1, 0, -50, 0, true);
      const inner = slideEl.querySelector<HTMLElement>(".ax-company-panel-inner");
      if (inner) inner.style.transform = `scale(${scale}) translateX(${x}%)`;
    });
  }, []);

  const { sliderRef, ready } = useKeen(listRef, ({ onCreated }) => ({
    selector: ".ax-slide",
    loop: true,
    slides: { perView: 1 },
    defaultAnimation: { duration: CAROUSEL_DURATION, easing: easeCarousel },
    rubberband: true,
    dragSpeed: 1,
    created: (s) => {
      onCreated();
      applyImageScale(s);
    },
    detailsChanged: applyImageScale,
    slideChanged: (s) => setIdx(s.track.details.rel),
  }));

  /* card drift: teamDesktop ±25svh / teamMobile ±50px across the section */
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
        waypointTrigger({
          el: cardRef.current,
          measure: sectionRef.current,
          waypoints: md
            ? [
                { a: 100, b: 0, transform: "translateY(25svh)" },
                { a: 0, b: 100, transform: "translateY(-25svh)" },
              ]
            : [
                { a: 100, b: 0, transform: "translateY(50px)" },
                { a: 0, b: 100, transform: "translateY(-50px)" },
              ],
        });
      },
    );
    return () => mm.revert();
  }, []);

  /* native-scroller sync (change.mobile-scrollable equivalent) */
  const onScroll = useCallback(() => {
    const list = listRef.current;
    if (!list || sliderRef.current) return;
    const item = list.querySelector<HTMLElement>(".ax-slide");
    if (!item) return;
    const i = Math.round(list.scrollLeft / (item.offsetWidth + 10));
    setIdx(Math.min(companies.length - 1, Math.max(0, i)));
  }, [sliderRef]);

  const prev = () =>
    sliderRef.current ? sliderRef.current.prev() : scrollByItem(listRef.current, -1);
  const next = () =>
    sliderRef.current ? sliderRef.current.next() : scrollByItem(listRef.current, 1);

  const active = companies[idx];

  return (
    <section
      id="companies-recap"
      ref={sectionRef}
      data-ax-theme="light"
      data-nav-section="companies"
      className="ax-section ax-light ax-team"
    >
      <div className="ax-container ax-team-inner">
        <FlickerTitle
          as="h2"
          className="ax-h1 ax-team-title"
          reveal="title"
          segments={[
            "Five companies,",
            "\n",
            { text: "one standard.", className: "ax-accent-b" },
          ]}
        />
        <div className="ax-team-stage">
          <div className={"ax-carousel" + (ready ? " ax-carousel--ready" : "")}>
            <div className="ax-carousel-viewport ax-team-viewport">
              <ul ref={listRef} className="ax-carousel-list" onScroll={onScroll}>
                {companies.map((c) => (
                  <li key={c.slug} className="ax-slide">
                    <div
                      className="ax-company-panel"
                      style={{ "--co": stopAccents[c.slug as keyof typeof stopAccents] ?? "#1367FE" } as React.CSSProperties}
                    >
                      <div className="ax-company-panel-inner">
                        <span className="ax-company-initial" aria-hidden="true">
                          {c.name[0]}
                        </span>
                        <span className="ax-company-wordmark">{c.name}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ax-team-content ax-grid">
            <div ref={cardRef} className="ax-testimonial-card">
              {companies.map((c, i) => (
                <div
                  key={c.slug}
                  data-ax-swap-item
                  data-inactive={idx !== i || undefined}
                  aria-hidden={idx !== i}
                >
                  <FlickerTitle
                    as="h3"
                    className="ax-h3 ax-team-name"
                    runKey={`n-${idx}`}
                    segments={[c.name]}
                  />
                  <FlickerText
                    as="p"
                    className="ax-t2 ax-team-role"
                    runKey={`r-${idx}`}
                    segments={[c.region]}
                  />
                  <FlickerText
                    as="p"
                    className="ax-t1 ax-team-desc"
                    runKey={`d-${idx}`}
                    segments={[`${c.oneLiner} ${c.proof}.`]}
                  />
                  <Link href={`/companies/${c.slug}`} className="ax-team-link">
                    Explore {c.name} →
                  </Link>
                </div>
              ))}
              <div className="ax-team-card-nav">
                <p className="ax-team-counter" aria-hidden="true">
                  {String(idx + 1).padStart(2, "0")} / {String(companies.length).padStart(2, "0")}
                </p>
                <div className="ax-carousel-nav">
                  <NavButton onTrigger={prev} label={`Previous company (showing ${active.name})`}>
                    <ArrowLeft />
                  </NavButton>
                  <NavButton onTrigger={next} label={`Next company (showing ${active.name})`}>
                    <ArrowRight />
                  </NavButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
