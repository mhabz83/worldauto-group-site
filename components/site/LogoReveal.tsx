"use client";

import { useEffect, useRef, useState } from "react";
import "./logo-reveal.css";

/* Site loading overlay. Plays the approved WAG logo reveal once per session on
   the first full page load, then HANDS OFF into the site — the reveal resolves
   INTO the homepage so a visitor can't tell where the intro ends and the site
   begins.

   Visibility is driven by the pre-paint script in app/layout.tsx, which adds
   `wag-reveal-active` to <html> only on the first visit of a session (and sets
   the session flag). That keeps server and client markup identical (no hydration
   mismatch) and stops repeat loads from flashing the overlay. This component
   just runs the timeline and the hand-off.

   THE HAND-OFF (replaces the old plain opacity fade-out):
   1. Wordmark -> nav logo. The centred reveal wordmark shrinks and travels to
      the exact rect of the REAL site nav wordmark (a FLIP transform measured at
      hand-off time), then cross-hands to it — the real nav logo fades up under
      the landing wordmark as the overlay wordmark fades out, so there is never
      a jump or two logos on screen.
   2. Trails -> hero road. The reveal's light-trails sweep downward as the
      navy backdrop dissolves, so they read as continuing into the hero's neon
      road underneath rather than being cut.
   3. Hold until hero ready. The hand-off does not start until the WebGL hero
      has painted its first frame (the `wag:hero-ready` signal from NeonJourney),
      with a hard max-timeout so the overlay can never hang. */

const SESSION_KEY = "wag-reveal-shown";
const FADE_MS = 600; // fallback opacity fade (no nav target / no measure)
// hold long enough for the sequence to land (trails, wipe, ignite, sweep,
// tagline) before the hand-off can begin
const PLAY_HOLD_MS = 4500;
const REDUCED_HOLD_MS = 800;
// hand-off choreography
const HANDOFF_MS = 1200; // wordmark travel + backdrop dissolve + trail sweep
const CROSSHAND_MS = 340; // trailing window where the real nav logo fades up
// safety net: force the hand-off even if the hero never signals ready, so the
// overlay can never hang on a slow or erroring hero
const HANDOFF_MAX_MS = 6000;

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

    const timers: number[] = [];
    let removeReadyListener: (() => void) | null = null;
    let handedOff = false;

    // Overlay is finished: pin the real nav logo visible (belt and braces even
    // if the class removal races) and drop the overlay for good.
    const finish = () => {
      setGone(true);
      root.classList.add("wag-handoff-land");
      root.classList.remove("wag-reveal-active");
    };

    // Reduced motion: no cinematic hand-off. Show the static logo briefly, then
    // cross the real nav logo in as the overlay fades — the site appears
    // immediately, exactly as before.
    if (reduce) {
      timers.push(
        window.setTimeout(() => {
          setHiding(true);
          root.classList.add("wag-handoff-land");
        }, REDUCED_HOLD_MS),
      );
      timers.push(window.setTimeout(finish, REDUCED_HOLD_MS + FADE_MS + 40));
      return () => timers.forEach((t) => window.clearTimeout(t));
    }

    const startHandoff = () => {
      if (handedOff) return;
      handedOff = true;
      removeReadyListener?.();

      const mark = stage?.querySelector<HTMLElement>(".wag-mark") ?? null;
      const nav = document.querySelector<HTMLElement>(".journey-wordmark");

      if (stage && mark && nav) {
        // FLIP: map the centred reveal wordmark onto the real nav wordmark's
        // live rect (height match = size match; centre-to-centre = position).
        // The last-moment cross-fade hides the small font difference between
        // the two lockups, so a box match is all we need here.
        const src = mark.getBoundingClientRect();
        const dst = nav.getBoundingClientRect();
        if (src.height > 0 && dst.height > 0) {
          const scale = dst.height / src.height;
          const dx = dst.left + dst.width / 2 - (src.left + src.width / 2);
          const dy = dst.top + dst.height / 2 - (src.top + src.height / 2);
          stage.style.setProperty(
            "--mark-tf",
            `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${scale.toFixed(4)})`,
          );
          stage.classList.add("handoff");
          // Cross-hand: bring the real nav logo up exactly as the travelling
          // wordmark lands, then remove the overlay.
          timers.push(
            window.setTimeout(
              () => root.classList.add("wag-handoff-land"),
              HANDOFF_MS - CROSSHAND_MS,
            ),
          );
          timers.push(window.setTimeout(finish, HANDOFF_MS + 60));
          return;
        }
      }

      // Fallback (no nav target / could not measure): the original plain
      // opacity fade-out.
      setHiding(true);
      timers.push(window.setTimeout(finish, FADE_MS + 40));
    };

    // Once the reveal has settled, wait for the hero's first painted frame,
    // then hand off. A window flag backs the event so a signal that fired
    // before this listener attaches is still honoured.
    const waitForHeroThenHandoff = () => {
      const w = window as unknown as Record<string, unknown>;
      if (w.__wagHeroReady) {
        startHandoff();
        return;
      }
      const onReady = () => {
        removeReadyListener?.();
        startHandoff();
      };
      window.addEventListener("wag:hero-ready", onReady);
      removeReadyListener = () => {
        window.removeEventListener("wag:hero-ready", onReady);
        removeReadyListener = null;
      };
    };

    timers.push(window.setTimeout(waitForHeroThenHandoff, PLAY_HOLD_MS));
    // hard safety net so the overlay never hangs on a slow/erroring hero
    timers.push(window.setTimeout(startHandoff, HANDOFF_MAX_MS));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      removeReadyListener?.();
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
        {/* Navy backdrop as its own layer so the hand-off can dissolve it to
            expose the hero without touching the trails or wordmark. */}
        <div className="wag-backdrop" aria-hidden="true" />

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
