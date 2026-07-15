"use client";

/**
 * Waypoint engine — a GSAP ScrollTrigger port of the recovered declarative
 * parallax engine that drives the reference /about experience.
 *
 * Recovered semantics (see the recovery spec §1):
 *   a waypoint `A-B` resolves to an absolute scroll position
 *     scrollPos = measuredTop + measuredHeight * (B/100) − viewport * (A/100)
 *   and the engine linearly interpolates every numeric token of the declared
 *   `transform` strings (and `opacity`) between consecutive waypoints.
 *
 * We keep native scroll and reproduce the smooth-scroll lerp feel
 * (Locomotive lerp 0.1 / mobile lerp 0.05) with ScrollTrigger `scrub`.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/* Scrub values approximating the recovered lerp strengths. */
export const SCRUB_DESKTOP = 0.4; // Locomotive lerp 0.1
export const SCRUB_SMOOTH = 0.75; // mobileSmooth lerp 0.05

export type Waypoint = {
  /** viewport offset A — % of viewport height (svh semantics) */
  a: number;
  /** element offset B — % of the measured element's height */
  b: number;
  transform?: string;
  opacity?: number;
};

export type WaypointTriggerConfig = {
  /** element that receives the interpolated styles (unless `apply` given) */
  el: Element | null;
  /** element measured for the A-B math (`data-parallax-measure-selector`) */
  measure?: Element | null;
  /** static list or a function re-evaluated on every ScrollTrigger refresh */
  waypoints: Waypoint[] | (() => Waypoint[]);
  scrub?: number | boolean;
  onProgress?: (p: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  /** custom style writer; receives interpolated values + progress */
  apply?: (values: { transform?: string; opacity?: number }, p: number) => void;
};

const NUM_RE = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

/** Interpolate every numeric token of `a` toward the tokens of `b` (the
    recovered engine's exact string-lerp behaviour). */
export function lerpString(a: string, b: string, t: number): string {
  const bTokens = b.match(NUM_RE) ?? [];
  let i = 0;
  return a.replace(NUM_RE, (token) => {
    const av = parseFloat(token);
    const bt = bTokens[i++];
    const bv = bt === undefined ? av : parseFloat(bt);
    const v = av + (bv - av) * t;
    return String(Math.round(v * 10000) / 10000);
  });
}

export function mapLinear(
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number,
  clamp = false,
): number {
  let t = (x - a1) / (a2 - a1);
  if (clamp) t = Math.min(1, Math.max(0, t));
  return b1 + (b2 - b1) * t;
}

/** cubic-bezier(x1, y1, x2, y2) solver → easing fn for keen-slider. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(err) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    if (t < 0 || t > 1) {
      let lo = 0;
      let hi = 1;
      t = x;
      while (hi - lo > 1e-5) {
        t = (lo + hi) / 2;
        if (sampleX(t) < x) lo = t;
        else hi = t;
      }
    }
    return sampleY(t);
  };
}

/** the reference carousel easing — cubic-bezier(.6, 0, .1, 1), 1000 ms */
export const easeCarousel = cubicBezier(0.6, 0, 0.1, 1);
export const CAROUSEL_DURATION = 1000;

type Segment = { frac: number; wp: Waypoint };

/**
 * Create one scrubbed ScrollTrigger reproducing a waypoint group.
 * Returns the ScrollTrigger (kill() to dispose).
 */
export function waypointTrigger(cfg: WaypointTriggerConfig): ScrollTrigger | null {
  const target = cfg.el as HTMLElement | null;
  if (!target && !cfg.apply && !cfg.onProgress) return null;
  const measureEl = (cfg.measure ?? cfg.el) as HTMLElement | null;
  if (!measureEl) return null;

  let segments: Segment[] = [];
  let startPos = 0;
  let endPos = 1;

  const recompute = () => {
    const wps = typeof cfg.waypoints === "function" ? cfg.waypoints() : cfg.waypoints;
    const rect = measureEl.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const h = rect.height;
    const vh = window.innerHeight;
    const entries = wps
      .map((wp) => ({ pos: top + h * (wp.b / 100) - vh * (wp.a / 100), wp }))
      .sort((m, n) => m.pos - n.pos);
    startPos = entries[0].pos;
    endPos = Math.max(entries[entries.length - 1].pos, startPos + 1);
    const span = endPos - startPos;
    segments = entries.map((e) => ({ frac: (e.pos - startPos) / span, wp: e.wp }));
  };

  const applyValues = (p: number) => {
    if (segments.length < 2) return;
    let i = 0;
    while (i < segments.length - 2 && p > segments[i + 1].frac) i++;
    const s0 = segments[i];
    const s1 = segments[i + 1];
    const local =
      s1.frac === s0.frac ? 1 : Math.min(1, Math.max(0, (p - s0.frac) / (s1.frac - s0.frac)));
    const out: { transform?: string; opacity?: number } = {};
    if (s0.wp.transform !== undefined && s1.wp.transform !== undefined) {
      out.transform = lerpString(s0.wp.transform, s1.wp.transform, local);
    }
    if (s0.wp.opacity !== undefined && s1.wp.opacity !== undefined) {
      out.opacity = s0.wp.opacity + (s1.wp.opacity - s0.wp.opacity) * local;
    }
    if (cfg.apply) {
      cfg.apply(out, p);
    } else if (target) {
      if (out.transform !== undefined) target.style.transform = out.transform;
      if (out.opacity !== undefined) target.style.opacity = String(out.opacity);
    }
    cfg.onProgress?.(p);
  };

  const state = { p: 0 };
  const tween = gsap.fromTo(
    state,
    { p: 0 },
    {
      p: 1,
      ease: "none",
      paused: true,
      immediateRender: false,
      onUpdate: () => applyValues(state.p),
    },
  );

  const st = ScrollTrigger.create({
    start: () => {
      recompute();
      return startPos;
    },
    end: () => endPos,
    animation: tween,
    scrub: cfg.scrub ?? SCRUB_DESKTOP,
    invalidateOnRefresh: true,
    onEnter: cfg.onEnter,
    onLeave: cfg.onLeave,
    onEnterBack: cfg.onEnterBack,
    onLeaveBack: cfg.onLeaveBack,
    onRefresh: (self) => {
      // settle immediately on load/resize (no catch-up tween from 0)
      state.p = self.progress;
      applyValues(self.progress);
    },
  });

  return st;
}
