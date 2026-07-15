"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { nav } from "@/content/site";

/** Live HQ clock, Metalab-style. Renders empty until mounted to avoid hydration drift. */
function HQClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dubai",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <MonoLabel tone="default" className="min-w-[7.5rem] text-end">
      {time && `AUH ${time}`}
    </MonoLabel>
  );
}

/**
 * Metalab chrome: Menu pill at the start, wordmark dead center, HQ clock and
 * Partner CTA at the end. Transparent over the hero; translucent blur +
 * hairline after 120px. The menu is a full-screen sheet with serif anchors.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--dur-med)]",
        scrolled || open
          ? "border-b border-hairline bg-[rgba(2,7,17,0.72)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] py-4">
        <div className="justify-self-start">
          <button
            type="button"
            className="type-kicker rounded-full border border-hairline-strong px-5 py-3 text-hi transition-colors duration-[var(--dur-fast)] hover:border-accent-hover hover:text-accent-hover"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <Link
          href="/"
          className="type-kicker justify-self-center text-hi"
          onClick={() => setOpen(false)}
        >
          {nav.wordmark.strong}
          <span aria-hidden className="mx-1 text-accent-hover">
            ·
          </span>
          <span className="font-normal text-low">{nav.wordmark.thin}</span>
        </Link>

        <div className="flex items-center gap-6 justify-self-end">
          <span className="hidden md:block">
            <HQClock />
          </span>
          <a
            href={nav.cta.href}
            onClick={() => setOpen(false)}
            className="type-kicker hidden rounded-full border border-hairline-strong px-5 py-3 text-hi transition-colors duration-[var(--dur-fast)] hover:border-accent-hover hover:text-accent-hover sm:block"
          >
            {nav.cta.label}
          </a>
        </div>
      </div>

    </header>

      {/* full-screen menu sheet: serif anchors, mono numbering.
          Sibling of the header — a backdrop-filtered ancestor would become
          the containing block for this fixed panel and collapse it. */}
      <div
        id="site-menu"
        className={cn(
          "fixed inset-0 top-[61px] z-40 flex-col justify-between bg-[rgba(2,7,17,0.97)] px-[var(--gutter)] py-14 backdrop-blur-xl",
          open ? "flex" : "hidden",
        )}
      >
        <nav aria-label="Primary" className="flex flex-col gap-7">
          {nav.links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group/menu flex items-baseline gap-6"
            >
              <MonoLabel tone="faint">{String(i + 1).padStart(2, "0")}</MonoLabel>
              <span className="type-editorial-sub transition-colors duration-[var(--dur-fast)] group-hover/menu:text-accent-hover">
                {link.label.toLowerCase()}
              </span>
            </a>
          ))}
        </nav>
        <a
          href={nav.cta.href}
          onClick={() => setOpen(false)}
          className="type-kicker inline-flex w-fit items-center gap-3 rounded-full bg-accent px-7 py-4 text-hi glow-accent"
        >
          {nav.cta.label} <span aria-hidden>→</span>
        </a>
      </div>
    </>
  );
}
