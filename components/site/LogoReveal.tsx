"use client";

import { useEffect, useRef, useState } from "react";
import "./logo-reveal.css";

/* Site loading overlay. Plays the approved WAG logo reveal once per session on
   the first full page load, then fades out to reveal the site underneath.

   Visibility is driven by the pre-paint script in app/layout.tsx, which adds
   `wag-reveal-active` to <html> only on the first visit of a session (and sets
   the session flag). That keeps server and client markup identical (no hydration
   mismatch) and stops repeat loads from flashing the overlay. This component
   just runs the timeline and the fade-out. */

const SESSION_KEY = "wag-reveal-shown";
const FADE_MS = 600;
// hold long enough for the sequence to land (trails, wipe, ignite, sweep, tagline)
// before starting the fade; then the site is visible underneath.
const PLAY_HOLD_MS = 4100;
const REDUCED_HOLD_MS = 800;

export function LogoReveal() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Only the first visit of the session gets the active class from the
    // pre-paint script. Anything else: the CSS already keeps the overlay
    // display:none (it only shows under :root.wag-reveal-active), so there is
    // nothing to run and nothing to intercept clicks. Just bail out.
    if (!root.classList.contains("wag-reveal-active")) {
      return;
    }

    // Belt and braces: make sure the session flag is set so a fast reload skips.
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable: overlay still plays this once, harmless */
    }

    const stage = stageRef.current;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (stage) {
      // force a reflow so the animation classes take effect cleanly
      void stage.offsetWidth;
      stage.classList.add(reduce ? "static" : "play");
    }

    const hold = reduce ? REDUCED_HOLD_MS : PLAY_HOLD_MS;
    const fadeTimer = window.setTimeout(() => setHiding(true), hold);
    const goneTimer = window.setTimeout(() => {
      setGone(true);
      root.classList.remove("wag-reveal-active");
    }, hold + FADE_MS + 40);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  const className = [
    "wag-reveal",
    hiding ? "is-hiding" : "",
    gone ? "is-gone" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} aria-hidden="true">
      <div className="wag-stage" ref={stageRef} role="img" aria-label="World Automotive Group">
        <svg
          className="wag-trails"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <filter id="wagGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#wagGlow)" fill="none">
            {/* converge toward the wordmark line (~500,348); pathLength=1 so draw-on is length-agnostic */}
            <line x1="-40" y1="70" x2="500" y2="348" stroke="#0b6fd8" strokeWidth="1.4" pathLength="1" strokeDasharray="1" style={{ animationDelay: "0s" }} />
            <line x1="-40" y1="300" x2="500" y2="348" stroke="#ff6340" strokeWidth="1.1" pathLength="1" strokeDasharray="1" style={{ animationDelay: ".24s" }} />
            <line x1="-40" y1="560" x2="500" y2="348" stroke="#0b6fd8" strokeWidth="1.2" pathLength="1" strokeDasharray="1" style={{ animationDelay: ".4s" }} />
            <line x1="1040" y1="50" x2="500" y2="348" stroke="#ff6340" strokeWidth="1.3" pathLength="1" strokeDasharray="1" style={{ animationDelay: ".12s" }} />
            <line x1="1040" y1="290" x2="500" y2="348" stroke="#0b6fd8" strokeWidth="1.1" pathLength="1" strokeDasharray="1" style={{ animationDelay: ".32s" }} />
            <line x1="1040" y1="580" x2="500" y2="348" stroke="#ff6340" strokeWidth="1.2" pathLength="1" strokeDasharray="1" style={{ animationDelay: ".48s" }} />
          </g>
        </svg>

        <div className="wag-underglow" />

        <div className="wag-mark">
          <p className="layer outline" aria-hidden="true">
            <span className="p">WORLD</span>
            <span className="p">AUTO</span>
            <span className="p group">GROUP</span>
          </p>
          <p className="layer fill">
            <span className="p world">WORLD</span>
            <span className="p auto">AUTO</span>
            <span className="p group">GROUP</span>
          </p>
        </div>

        <div className="wag-tag">Performance · Mobility · Precision</div>
      </div>
    </div>
  );
}
