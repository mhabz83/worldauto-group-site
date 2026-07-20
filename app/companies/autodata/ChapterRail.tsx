"use client";

import { useEffect, useRef, useState } from "react";

/* Left chapter rail for the AutoData model page.
   Madar's page navigates its slides from a collapsed top-right select box;
   ours is a visible vertical rail on the left edge (01 / 02 / 03 with a
   cyan progress hairline), always readable without interaction. On phones
   it collapses to a slim cyan progress bar under the site header.
   Native scroll only: rAF-throttled scroll math, no hijacking. */

const CHAPTERS = [
  { id: "valuations", num: "01", label: "Valuations" },
  { id: "inspections", num: "02", label: "Inspections" },
  { id: "vehicle-history", num: "03", label: "Vehicle history" },
] as const;

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const wrapper = document.getElementById("ad-chapters");
    if (!wrapper) return;
    const sections = CHAPTERS.map((c) => document.getElementById(c.id));

    const measure = () => {
      raf.current = 0;
      const vh = window.innerHeight;
      const rect = wrapper.getBoundingClientRect();
      const total = Math.max(rect.height - vh, 1);
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(p);
      setVisible(rect.top < vh * 0.7 && rect.bottom > vh * 0.4);
      const mid = vh * 0.5;
      let current = 0;
      sections.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!raf.current) raf.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <nav
        className="ad-rail"
        aria-label="AutoData chapters"
        data-on-light={active === 1 || undefined}
        data-visible={visible || undefined}
      >
        <div className="ad-rail-inner">
          <div className="ad-rail-track" aria-hidden>
            <span
              className="ad-rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>
          <ol className="ad-rail-list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={i === active ? "true" : undefined}
                >
                  <span className="ad-rail-num">{c.num}</span>
                  <span className="ad-rail-label">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      {/* Phone: the rail becomes a slim progress bar under the header. */}
      <div className="ad-rail-bar" aria-hidden data-visible={visible || undefined}>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}
