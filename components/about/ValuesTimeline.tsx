"use client";

/**
 * S6 — the pinned values → timeline centerpiece.
 *
 * Recovered mechanics, scaled to our content (4 values + 4 timeline beats →
 * 800svh pin instead of Madar's 4+8 → 1120svh; every per-item number kept):
 * - values controller: index = floor(position * 4) across pin viewports 0→4
 * - rings: scroll-rotated −120° / −360° groups, hidden once the timeline phase
 *   begins (direction-aware enter/leave at the −400svh boundary)
 * - title morph at the same boundary (char-flicker in / instant out)
 * - progress indicator "01|04", hidden in phase B
 * - braid SVG: translateY 0 → (0.65·viewport − svgHeight)px across the pin
 * - per-item year parallax ±160px, center pins ±80px, pinLine rotation/scale
 *   interpolated by viewport width (1460px: −70°→−15°, .6→1.5;
 *   2400px: −62°→−27°, .7→1.3)
 * - mobile: swap controllers (year char-flicker, description cardText ±2.5svh)
 */

import { useEffect, useRef, useState } from "react";
import { journeyContent } from "@/components/hero/journeyContent";
import {
  gsap,
  mapLinear,
  SCRUB_DESKTOP,
  waypointTrigger,
} from "./engine";
import {
  FlickerText,
  FlickerTitle,
  usePrevious,
  useReducedMotion,
} from "./reveal";
import { BraidSvg, GlowSvg, PinBorder, RingsSvg } from "./svgs";

const pillars = journeyContent.model.pillars;
const beats = journeyContent.heritage.timeline;

export function ValuesTimeline() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringsG1 = useRef<SVGGElement>(null);
  const ringsG2 = useRef<SVGGElement>(null);
  const braidRef = useRef<SVGSVGElement>(null);
  const valuesTextRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [vIdx, setVIdx] = useState(0); // 0..3 value, 4 = blank slot
  const [phase, setPhase] = useState<0 | 1>(0);
  const [ringsHidden, setRingsHidden] = useState(false);
  const [braidHidden, setBraidHidden] = useState(true);
  const [counter, setCounter] = useState(1);
  const [indHidden, setIndHidden] = useState(false);
  const [mIdx, setMIdx] = useState(0); // mobile timeline: 0 blank, 1..4 beats
  const prevMIdx = usePrevious(mIdx);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;
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

        /* background glow: opacity .75→1, translateY 0→20% across the pin */
        waypointTrigger({
          el: glowRef.current,
          measure: sticky,
          waypoints: [
            { a: 0, b: 0, transform: "translateY(0%)", opacity: 0.75 },
            { a: 100, b: 100, transform: "translateY(20%)", opacity: 1 },
          ],
        });

        /* rings rotation: 100-0 → −400-0, −120° and −360° about (540,540) */
        waypointTrigger({
          el: ringsG1.current,
          measure: sticky,
          waypoints: [
            { a: 100, b: 0 },
            { a: -400, b: 0 },
          ],
          apply: (_v, p) => {
            ringsG1.current?.setAttribute("transform", `rotate(${p * -120} 540 540)`);
            ringsG2.current?.setAttribute("transform", `rotate(${p * -360} 540 540)`);
          },
        });

        /* phase boundary: rings hide / braid + title + indicator swap */
        waypointTrigger({
          el: sticky,
          measure: sticky,
          waypoints: [
            { a: -400, b: 0 },
            { a: 100, b: 100 },
          ],
          onEnter: () => {
            setRingsHidden(true);
            setBraidHidden(false);
            setPhase(1);
            setIndHidden(true);
          },
          onLeaveBack: () => {
            setRingsHidden(false);
            setBraidHidden(true);
            setPhase(0);
            setIndHidden(false);
          },
        });

        /* braid drift — valuesLines pattern (offset 400) */
        waypointTrigger({
          el: braidRef.current,
          measure: sticky,
          waypoints: () => {
            const h = braidRef.current?.getBoundingClientRect().height ?? 0;
            const end = 0.65 * window.innerHeight - h;
            return [
              { a: -400, b: 0, transform: "translateY(0px)" },
              { a: 100, b: 100, transform: `translateY(${end}px)` },
            ];
          },
        });

        /* values controller: index = floor(position * 4), one viewport per value */
        waypointTrigger({
          el: sticky,
          measure: sticky,
          waypoints: [
            { a: 0, b: 0 },
            { a: -400, b: 0 },
          ],
          onProgress: (p) => {
            const index = Math.min(Math.floor(p * 4), 4);
            setVIdx(index);
            setCounter(Math.min(Math.floor(p * 4), 3) + 1);
          },
        });

        /* Model -> Heritage handoff, staggered. Its own tightly-scrubbed
           trigger fades the value column (the last one visible is step-04)
           fully out — opacity to 0 with a slight lift — across the final
           stretch of the values phase, finishing at ~3.80 viewports (just
           before the heritage copy for the first beat begins its own fade at
           ~3.82 viewports and before the phase boundary at 4.00). So the Model
           copy is gone before any heritage text or the "1990s" year appears;
           the only thing that carries across the seam is the shared orbital
           ring / braid. Written through `apply` so it is a smooth fade, not
           the waypoint opacity rest-floor snap. */
        waypointTrigger({
          el: valuesTextRef.current,
          measure: sticky,
          scrub: true,
          waypoints: [
            { a: -332, b: 0 },
            { a: -380, b: 0 },
          ],
          apply: (_v, p) => {
            const vt = valuesTextRef.current;
            if (!vt) return;
            vt.style.opacity = String(1 - p);
            vt.style.transform = `translateY(${(-22 * p).toFixed(2)}px)`;
          },
        });

        if (md) {
          /* desktop timeline items: year ±160px, pin ±80px, pinLine pattern */
          itemRefs.current.forEach((item, i) => {
            if (!item) return;
            waypointTrigger({
              el: yearRefs.current[i],
              measure: item,
              waypoints:
                i === 0
                  ? [
                      /* first heritage year holds hidden through the phase
                         seam (opacity 0 up to and at the boundary), then fades
                         in just AFTER it — so "1990s" never shares the frame
                         with the exiting Model copy. Transform stays linear
                         160 -> -160 across the whole item, so the year parallax
                         is unchanged; only opacity is gated. */
                      { a: 100, b: 0, transform: "translateY(160px)", opacity: 0 },
                      { a: 0, b: 0, transform: "translateY(0px)", opacity: 0 },
                      { a: -24, b: 0, transform: "translateY(-38.4px)", opacity: 1 },
                      { a: 0, b: 100, transform: "translateY(-160px)", opacity: 1 },
                    ]
                  : [
                      { a: 100, b: 0, transform: "translateY(160px)" },
                      { a: 0, b: 100, transform: "translateY(-160px)" },
                    ],
            });
            waypointTrigger({
              el: pinRefs.current[i],
              measure: item,
              waypoints: [
                { a: 100, b: 0, transform: "translate(-50%, -50%) translateY(80px)" },
                { a: 0, b: 100, transform: "translate(-50%, -50%) translateY(-80px)" },
              ],
            });
            /* event copy — held on its 40svh line for the whole item passage
               (counter-translated 1:1 against scroll, scrub direct so it can
               never drift into the pinned heritage title band above ~288px),
               crossfading between beats. The last beat ends its hold at rest
               (translateY 0) so the copy leaves in flow with the section. */
            waypointTrigger({
              el: textRefs.current[i],
              measure: item,
              scrub: true,
              waypoints: () => {
                const vh = window.innerHeight;
                /* fades are sequential, never overlapping: the outgoing copy
                   is fully out (b:82) before the next one starts (a:18) at
                   the same absolute scroll position, so no rest position can
                   show two beats superimposed */
                const hold = [
                  { a: 100, b: 0, transform: `translateY(${-vh}px)`, opacity: 0 },
                  { a: 18, b: 0, transform: `translateY(${-0.18 * vh}px)`, opacity: 0 },
                  { a: 0, b: 0, transform: "translateY(0px)", opacity: 1 },
                ];
                if (i === beats.length - 1) return hold;
                return [
                  ...hold,
                  { a: 0, b: 65, transform: `translateY(${0.65 * vh}px)`, opacity: 1 },
                  { a: 0, b: 82, transform: `translateY(${0.82 * vh}px)`, opacity: 0 },
                  { a: 0, b: 100, transform: `translateY(${vh}px)`, opacity: 0 },
                ];
              },
            });
            waypointTrigger({
              el: tailRefs.current[i],
              measure: item,
              waypoints: () => {
                const w = window.innerWidth;
                const r0 = mapLinear(w, 1460, 2400, -70, -62);
                const r1 = mapLinear(w, 1460, 2400, -15, -27);
                const s0 = mapLinear(w, 1460, 2400, 0.6, 0.7);
                const s1 = mapLinear(w, 1460, 2400, 1.5, 1.3);
                return [
                  { a: 100, b: 0, transform: `rotate(${r0}deg) scale(${s0})` },
                  { a: 0, b: 100, transform: `rotate(${r1}deg) scale(${s1})` },
                ];
              },
            });
          });
        } else {
          /* mobile timeline controller:
             index = position === 0 ? 0 : round(position * (n-1)) + 1 */
          waypointTrigger({
            el: sticky,
            measure: sticky,
            scrub: SCRUB_DESKTOP,
            waypoints: [
              { a: -400, b: 0 },
              { a: 100, b: 100 },
            ],
            onProgress: (p) => {
              setMIdx(p === 0 ? 0 : Math.round(p * (beats.length - 1)) + 1);
            },
          });
        }
      },
    );

    return () => mm.revert();
  }, []);

  const counterLabel = String(counter).padStart(2, "0");

  return (
    <section
      id="model"
      data-ax-theme="dark"
      data-nav-section="model"
      className="ax-section ax-values"
    >
      <div ref={stickyRef} className="ax-values-sticky">
        {/* Heritage lives in the second half of the pin: an anchor for the
            header's #heritage link plus a nav marker so the active-section
            probe flips from The Model to Heritage at the timeline phase. */}
        <span id="heritage" className="ax-heritage-anchor" aria-hidden="true" />
        <div className="ax-heritage-zone" data-nav-section="heritage" aria-hidden="true" />
        {/* layer 1 — pinned background */}
        <div className="ax-values-layer-bg">
          <div className="ax-values-bg" aria-hidden="true">
            <div ref={glowRef} className="ax-values-glow">
              <GlowSvg />
            </div>
            <RingsSvg
              className={
                "ax-values-rings" + (ringsHidden ? " ax-values-rings--hidden" : "")
              }
              g1Ref={ringsG1}
              g2Ref={ringsG2}
            />
            <BraidSvg
              svgRef={braidRef}
              className={
                "ax-values-braid" + (braidHidden ? " ax-values-braid--hidden" : "")
              }
            />
          </div>
          {/* mobile-only center pin, appears with the timeline phase */}
          <div
            className={
              "ax-tl-mobile ax-pin ax-pin--large ax-tl-mobile-pin" +
              (!braidHidden ? " ax-pin--visible" : "")
            }
            style={{ "--pin-x": "50%", "--pin-y": "50%" } as React.CSSProperties}
            aria-hidden="true"
          >
            <PinBorder />
            <div className="ax-pin__background" />
            <div className="ax-pin__dot" />
          </div>
          <p
            className={
              "ax-progress-ind ax-small" + (indHidden ? " ax-progress-ind--hidden" : "")
            }
            aria-hidden="true"
          >
            <span className="ax-progress-ind__left">{counterLabel}</span>
            <span className="ax-progress-ind__right">04</span>
          </p>
        </div>

        {/* layer 2 — pinned titles + value swap */}
        <div className="ax-values-layer-top">
          <div className="ax-values-title">
            <div className="ax-container">
              <div className="ax-values-title-swap">
                <div
                  data-ax-swap-item
                  data-inactive={phase !== 0 || undefined}
                  aria-hidden={phase !== 0}
                >
                  <FlickerTitle
                    as="h2"
                    className="ax-h1"
                    runKey={`t-${phase}`}
                    segments={["The ", { text: "Model", className: "ax-accent-b" }]}
                  />
                </div>
                <div
                  data-ax-swap-item
                  data-inactive={phase !== 1 || undefined}
                  aria-hidden={phase !== 1}
                >
                  <FlickerTitle
                    as="h2"
                    className="ax-h2"
                    runKey={`t-${phase}`}
                    segments={[
                      { text: "Three Decades", className: "ax-accent-b" },
                      "\n",
                      "of Operating:",
                      "\n",
                      "The Group Timeline",
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div ref={valuesTextRef} className="ax-values-text">
            <div className="ax-container">
              <div className="ax-values-text-inner">
                <div className="ax-values-text-col">
                  <div className="ax-value-name">
                    {pillars.map((p, i) => (
                      <div
                        key={p.cue}
                        data-ax-swap-item
                        data-inactive={vIdx !== i || undefined}
                        aria-hidden={vIdx !== i}
                      >
                        <FlickerTitle
                          as="h3"
                          className="ax-h3"
                          runKey={`n-${vIdx}`}
                          segments={[p.cue]}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="ax-value-body">
                    {pillars.map((p, i) => (
                      <div
                        key={p.cue}
                        data-ax-swap-item
                        data-inactive={vIdx !== i || undefined}
                        aria-hidden={vIdx !== i}
                      >
                        <FlickerText
                          as="p"
                          className="ax-t2 ax-value-cue-title"
                          runKey={`ct-${vIdx}`}
                          segments={[p.title]}
                        />
                        <FlickerText
                          as="p"
                          className="ax-t1"
                          runKey={`b-${vIdx}`}
                          segments={[p.body]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* mobile phase B: year + description swap controllers */}
          <div className="ax-tl-mobile ax-tl-mobile-year" aria-hidden={mIdx === 0}>
            <div className="ax-container">
              {beats.map((b, i) => (
                <div
                  key={b.year}
                  data-ax-swap-item
                  data-inactive={mIdx !== i + 1 || undefined}
                  aria-hidden={mIdx !== i + 1}
                >
                  <FlickerTitle
                    as="h3"
                    className="ax-h1"
                    runKey={`my-${mIdx}`}
                    segments={[b.year]}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="ax-tl-mobile ax-tl-mobile-desc">
            <div className="ax-container">
              <div className="ax-tl-mobile-desc-swap">
                {prevMIdx !== undefined &&
                  prevMIdx !== mIdx &&
                  prevMIdx > 0 &&
                  !reduced && (
                    <div key={`out-${prevMIdx}`} className="ax-swap-out" aria-hidden="true">
                      <MobileBeat beat={beats[prevMIdx - 1]} />
                    </div>
                  )}
                {beats.map((b, i) => (
                  <div
                    key={b.year}
                    data-ax-swap-item
                    data-inactive={mIdx !== i + 1 || undefined}
                    aria-hidden={mIdx !== i + 1}
                    className={mIdx === i + 1 ? "ax-swap-in" : undefined}
                  >
                    <MobileBeat beat={b} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* layer 3 — timeline items in flow (desktop) */}
        <div className="ax-values-layer-items">
          {beats.map((b, i) => (
            <div
              key={b.year}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="ax-tl-item"
            >
              <div
                ref={(el) => {
                  yearRefs.current[i] = el;
                }}
                className="ax-tl-item-year"
              >
                <h3 className="ax-h1">{b.year}</h3>
              </div>
              <div
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="ax-tl-item-text"
              >
                {b.year === "Today" && (
                  <p className="ax-h2 ax-orange ax-tl-stat">32</p>
                )}
                <p className="ax-t1">
                  <strong>{b.title}.</strong> {b.detail}
                </p>
              </div>
              <div
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                className="ax-pin ax-pin--large ax-pin--visible ax-tl-pin"
                style={{ "--pin-x": "50%", "--pin-y": "52%" } as React.CSSProperties}
                aria-hidden="true"
              >
                <PinBorder />
                <div className="ax-pin__background" />
                <div className="ax-pin__dot" />
                <div
                  ref={(el) => {
                    tailRefs.current[i] = el;
                  }}
                  className="ax-pin__tail"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileBeat({ beat }: { beat: (typeof beats)[number] }) {
  return (
    <>
      {beat.year === "Today" && <p className="ax-h2 ax-orange ax-tl-stat">32</p>}
      <p className="ax-t1">
        <strong>{beat.title}.</strong> {beat.detail}
      </p>
    </>
  );
}
