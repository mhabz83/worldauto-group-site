"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts from 0 to `target` on first view over `duration` ms with the house
 * easing. Returns the ref to attach and the current value. Reduced motion
 * (or SSR) renders the final value immediately.
 */
export function useCountUp(target: number, duration = 1400, delay = 0) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    let timeout = 0;
    timeout = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // ease-out quint, matching --ease-reveal's feel
        const eased = 1 - Math.pow(1 - t, 5);
        setValue(target * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, target, duration, delay, reduced]);

  return { ref, value: reduced ? target : value };
}
