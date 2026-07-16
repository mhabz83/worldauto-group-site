"use client";

/**
 * S5 Leadership carousel + S7 Companies carousel.
 *
 * keen-slider (the exact library the reference embedded), configured per the
 * recovered spec: loop, 3/1 slides per view, 1000 ms cubic-bezier(.6,0,.1,1)
 * next/prev, rubberband drag, arrows firing on pointerdown, edge-fade classes,
 * native scroll-snap fallback below md and under reduced motion.
 *
 * S7 (companies) reproduces the recovered `imageScale` effect verbatim.
 * The team lineup uses its own depth model instead: neighbors at 90% scale,
 * pinned so the screen edge cuts them, never overlapping the centered person
 * (see applyImageScale in TeamCarousel), with char/word-flicker card swaps.
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
import { companies, team } from "@/content/site";
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
  opts?: { initUnderReducedMotion?: boolean },
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
      if (mq.matches && (!reduce.matches || opts?.initUnderReducedMotion)) {
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
/* S5 — Leadership (recovered board-of-directors carousel)              */
/* ------------------------------------------------------------------ */

export function TeamCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  /* Neighbors stand "further back" (90% scale), pinned so the SCREEN edge
     cuts into them, and never overlap the centered person. Positions are
     computed in px from each cutout's own width, interpolated by r so the
     glide between rest states stays continuous. */
  const applyImageScale = useCallback((s: KeenSliderInstance) => {
    const details = s.track.details;
    if (!details) return;
    const stage =
      (s.container.closest(".ax-team-stage") as HTMLElement) ?? s.container;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const cw = s.container.clientWidth;

    // pass 1: r + rendered cutout width per slide; active half-width for the guard
    // r comes from the continuous track position (shortest signed path around
    // the loop), NOT from keen's per-slide distance: that value side-flips at
    // the loop seam the moment a transition starts, which made the outgoing
    // neighbor vanish instead of sliding off.
    const N = s.slides.length;
    const size = 1 / TEAM_PER_VIEW;
    const tau = details.position / size;
    const rs: number[] = [];
    const ws: number[] = [];
    let activeHalf = 0;
    s.slides.forEach((slideEl, i) => {
      let d = (((i - tau) % N) + N) % N;
      if (d > N / 2) d -= N;
      const r = -d * size;
      rs[i] = r;
      const img = slideEl.querySelector<HTMLImageElement>("img");
      const scale = mapLinear(Math.abs(r), 0, 1, 1, IMAGE_SCALE_MIN, true);
      const w =
        img && img.naturalHeight
          ? (img.naturalWidth / img.naturalHeight) * H * TEAM_IMG_HEIGHT * scale
          : 0;
      ws[i] = w;
      if (Math.abs(r) < 0.5) activeHalf = Math.max(activeHalf, w / 2);
    });

    s.slides.forEach((slideEl, i) => {
      const r = rs[i];
      const w = ws[i];
      const scale = mapLinear(Math.abs(r), 0, 1, 1, IMAGE_SCALE_MIN, true);
      // keen may park this slide on the OTHER side of the loop seam; the
      // translate bridges from where keen actually put it to where the
      // continuous model wants it
      const rKeen = -(details.slides[i].distance - TEAM_ORIGIN);
      const actualCenter = W / 2 - rKeen * cw;
      const idealCenter = W / 2 - r * cw;
      let desired = idealCenter;
      if (w > 0 && Math.abs(r) > 0.001) {
        // rest target: person center such that TEAM_EDGE_CUT of them hangs
        // off-screen, but never closer to the middle than the active person
        let target =
          r < 0
            ? Math.max(
                W - (0.5 - TEAM_EDGE_CUT) * w,
                W / 2 + activeHalf + 16 + w / 2,
              )
            : Math.min(
                (0.5 - TEAM_EDGE_CUT) * w,
                W / 2 - activeHalf - 16 - w / 2,
              );
        if (r > 0) {
          // keep the left neighbor's head clear of the card
          const vhpx = window.innerHeight / 100;
          const cardW = Math.min(
            TEAM_CARD_MAX_W,
            Math.max(TEAM_CARD_MIN_W, W / 2 - 50 * vhpx - 16),
          );
          const cardLeft = W / 2 - TEAM_CARD_RIGHT_VH * vhpx - cardW;
          target = Math.min(target, cardLeft - 12 - 0.18 * w);
        }
        // slides beyond the immediate neighbors keep receding past the edge
        // instead of stacking on it
        if (Math.abs(r) > 1) {
          target += Math.sign(-r) * (Math.abs(r) - 1) * w * 1.15;
        }
        desired = idealCenter + Math.min(Math.abs(r), 1) * (target - idealCenter);
      }
      const x = desired - actualCenter;
      const inner = slideEl.querySelector<HTMLElement>(".ax-company-panel-inner");
      if (inner) inner.style.transform = `translateX(${x}px) scale(${scale})`;
      // centered person always renders in front of the receding neighbors
      slideEl.style.zIndex = String(20 - Math.round(Math.min(Math.abs(r), 3) * 5));
    });
  }, []);

  const { sliderRef, ready } = useKeen(
    listRef,
    ({ onCreated }) => ({
      selector: ".ax-slide",
      loop: true,
      /* perView slightly over 1: keeps the active slide centered while
         giving it a positive origin, which is what makes keen place the
         previous slide to the LEFT at rest (origin 0 parks it off-right) */
      slides: { perView: TEAM_PER_VIEW, origin: "center", spacing: 0 },
      defaultAnimation: {
        // instant snaps for reduced-motion users; the glide for everyone else
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : CAROUSEL_DURATION,
        easing: easeCarousel,
      },
      rubberband: true,
      dragSpeed: 1,
      created: (s) => {
        onCreated();
        applyImageScale(s);
      },
      detailsChanged: applyImageScale,
      slideChanged: (s) => setIdx(s.track.details.rel),
    }),
    { initUnderReducedMotion: true },
  );

  /* No scroll drift on the card here (unlike the Madar S7 original): it is
     parked in the one pocket that clears every silhouette, and any translateY
     would push it onto someone. */

  const onScroll = useCallback(() => {
    const list = listRef.current;
    if (!list || sliderRef.current) return;
    const item = list.querySelector<HTMLElement>(".ax-slide");
    if (!item) return;
    const i = Math.round(list.scrollLeft / (item.offsetWidth + 10));
    setIdx(Math.min(team.length - 1, Math.max(0, i)));
  }, [sliderRef]);

  const prev = () =>
    sliderRef.current ? sliderRef.current.prev() : scrollByItem(listRef.current, -1);
  const next = () =>
    sliderRef.current ? sliderRef.current.next() : scrollByItem(listRef.current, 1);

  const active = team[idx];

  return (
    <section
      id="leadership"
      ref={sectionRef}
      data-ax-theme="light"
      className="ax-section ax-light ax-team ax-team-people"
    >
      <div className="ax-container ax-team-inner">
        <FlickerTitle
          as="h2"
          className="ax-h1 ax-team-title"
          reveal="title"
          segments={[{ text: "The Team", className: "ax-accent-b" }]}
        />
        <div className="ax-team-stage">
          <div className={"ax-carousel" + (ready ? " ax-carousel--ready" : "")}>
            <div className="ax-carousel-viewport ax-team-viewport">
              <ul ref={listRef} className="ax-carousel-list" onScroll={onScroll}>
                {team.map((t) => (
                  <li key={t.name} className="ax-slide">
                    <div className="ax-person-cut">
                      <div className="ax-company-panel-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element -- keen measures raw imgs */}
                        <img
                          src={t.image}
                          alt={`${t.name}, ${t.role}`}
                          draggable={false}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ax-team-content ax-grid">
            <div ref={cardRef} className="ax-testimonial-card">
              {team.map((t, i) => (
                <div
                  key={t.name}
                  data-ax-swap-item
                  data-inactive={idx !== i || undefined}
                  aria-hidden={idx !== i}
                >
                  <FlickerTitle
                    as="h3"
                    className="ax-h3 ax-team-name"
                    runKey={`tn-${idx}`}
                    segments={[t.name]}
                  />
                  <FlickerText
                    as="p"
                    className="ax-t2 ax-team-role"
                    runKey={`tr-${idx}`}
                    segments={[t.role]}
                  />
                </div>
              ))}
              <div className="ax-team-card-nav">
                <p className="ax-team-counter" aria-hidden="true">
                  {String(idx + 1).padStart(2, "0")} / {String(team.length).padStart(2, "0")}
                </p>
                <div className="ax-carousel-nav">
                  <NavButton onTrigger={prev} label={`Previous team member (showing ${active.name})`}>
                    <ArrowLeft />
                  </NavButton>
                  <NavButton onTrigger={next} label={`Next team member (showing ${active.name})`}>
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

/* ------------------------------------------------------------------ */
/* S7 — Five companies, one standard (recovered team carousel)          */
/* ------------------------------------------------------------------ */

const IMAGE_SCALE_MIN = 0.82; /* neighbors sit clearly "further back" */
const TEAM_PER_VIEW = 1.05;
const TEAM_ORIGIN = 0.5 - 1 / TEAM_PER_VIEW / 2;
const TEAM_IMG_HEIGHT = 0.97; /* mirrors .ax-team-people .ax-person-cut img */
const TEAM_EDGE_CUT = 0.5; /* fraction of a neighbor the screen edge cuts off */
/* card geometry mirror of .ax-team-people .ax-testimonial-card -- the left
   neighbor is pushed further off-screen when needed so its head never slides
   under the card at narrow desktop widths */
const TEAM_CARD_RIGHT_VH = 30;
const TEAM_CARD_MIN_W = 220;
const TEAM_CARD_MAX_W = 400;

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
