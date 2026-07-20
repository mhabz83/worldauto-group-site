"use client";

/**
 * S8 — "The Group in Numbers" as ONE full-viewport instrument band.
 * Replaces the recovered 4-plate stacked-sticky-cards machine (~400svh of
 * scroll) with a single full-bleed panel: four display figures over a neon
 * road motif, count-up on entry.
 *
 * Contracts kept from the old section:
 * - id="numbers" (progress rail + fragment links).
 * - NO data-nav-section: the header scrollspy CLEARS while this band owns
 *   the viewport centre (nothing in the nav claims it).
 * - The tilde hedges stay — these figures are qualified, and the single
 *   footnote carries the Skelmore scope line exactly once on the page.
 * - prefers-reduced-motion: figures render settled (they are the SSR markup;
 *   the count-up only ever arms when motion is allowed).
 */

import { useEffect, useRef } from "react";

const COUNT_MS = 1600;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-count-to]"));
    if (nodes.length === 0) return;

    const format = (el: HTMLElement, value: number) =>
      el.dataset.countFormat === "comma"
        ? Math.round(value).toLocaleString("en-US")
        : String(Math.round(value));
    const settle = () => {
      for (const el of nodes) el.textContent = format(el, Number(el.dataset.countTo));
    };

    // Only park the figures at zero once we know we can animate them in.
    for (const el of nodes) el.textContent = format(el, 0);

    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min((now - t0) / COUNT_MS, 1);
          for (const el of nodes) el.textContent = format(el, Number(el.dataset.countTo) * easeOut(k));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      settle();
    };
  }, [rootRef]);
}

export function GroupNumbersPanel() {
  const rootRef = useRef<HTMLElement>(null);
  useCountUp(rootRef);

  return (
    <section
      id="numbers"
      ref={rootRef}
      data-ax-theme="dark"
      className="ax-section ax-numbers-band"
      aria-label="The Group in Numbers"
    >
      <div className="axn-road" aria-hidden="true">
        <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <filter id="axn-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="axn-horizon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1367fe" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#1367fe" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="720" cy="430" rx="560" ry="150" fill="url(#axn-horizon)" />
          <g filter="url(#axn-glow)" fill="none" strokeLinecap="round">
            <path d="M0 430 H1440" stroke="#1367fe" strokeWidth="1" opacity="0.3" />
            <path d="M-80 880 L706 434" stroke="#1367fe" strokeWidth="2.4" opacity="0.75" />
            <path d="M1520 880 L734 434" stroke="#1367fe" strokeWidth="2.4" opacity="0.75" />
            <path d="M320 900 L712 437" stroke="#1367fe" strokeWidth="1.3" opacity="0.42" />
            <path d="M1120 900 L728 437" stroke="#1367fe" strokeWidth="1.3" opacity="0.42" />
            <path d="M720 900 V446" stroke="#ff4200" strokeWidth="1.6" opacity="0.6" strokeDasharray="26 38" />
          </g>
        </svg>
      </div>

      <p className="axn-eyebrow">The Group in Numbers</p>

      <div className="axn-grid">
        <div className="axn-cell">
          <p className="axn-figure">
            <span data-count-to="1994">1994</span>
          </p>
          <p className="axn-label">Founded, Abu Dhabi</p>
        </div>
        <div className="axn-cell">
          <p className="axn-figure">
            <span className="axn-tilde">~</span>
            <span data-count-to="4000" data-count-format="comma">4,000</span>
          </p>
          <p className="axn-label">People across the group</p>
        </div>
        <div className="axn-cell">
          <p className="axn-figure">
            MENA<span className="axn-dot">·</span>NA
          </p>
          <p className="axn-label">Two operating regions</p>
        </div>
        <div className="axn-cell">
          <p className="axn-figure">
            <span className="axn-tilde">~</span>
            <span className="axn-unit">USD</span>
            <span data-count-to="650">650</span>
            <span className="axn-unit">M</span>
          </p>
          <p className="axn-label">Annual group revenue</p>
        </div>
      </div>

      <p className="axn-footnote">Group figures include all Skelmore operations.</p>
    </section>
  );
}
