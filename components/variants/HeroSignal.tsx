"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { nav } from "@/content/site";
import { hero } from "@/content/home";

/* The W monogram path: one continuous stroke, drawn like an interchange. */
const W_PATH = "M60,60 L190,270 L330,80 L470,270 L600,60";
const W_LENGTH = 1020;

/** Button with Metalab-style magnetism: it leans toward the cursor. */
function MagneticButton({
  href,
  children,
  solid = false,
}: {
  href: string;
  children: React.ReactNode;
  solid?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={reduced ? undefined : { x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={
        solid
          ? "type-kicker group/mag relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-7 py-4 text-hi glow-accent"
          : "type-kicker group/mag relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-hairline-strong px-7 py-4 text-hi"
      }
    >
      {/* fill sweep */}
      <span
        aria-hidden
        className={
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-[var(--dur-med)] ease-[var(--ease-reveal)] group-hover/mag:scale-x-100 " +
          (solid ? "bg-accent-hover" : "bg-[rgba(46,143,239,0.14)]")
        }
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="relative inline-block transition-transform duration-[var(--dur-med)] ease-[var(--ease-reveal)] group-hover/mag:translate-x-1"
      >
        →
      </span>
    </motion.a>
  );
}

/** The living monogram: draws itself, then a light pulse travels it forever. */
function Monogram() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 60, damping: 14 });
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 60, damping: 14 });

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-3xl"
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <svg viewBox="0 0 660 330" fill="none" className="w-full" role="img" aria-label="Abstract WAG monogram: a W drawn as one continuous road">
        <defs>
          <linearGradient id="wag-pulse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0B6FD8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#2E8FEF" />
            <stop offset="1" stopColor="#9CCBFA" />
          </linearGradient>
          <filter id="wag-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* the road */}
        <motion.path
          d={W_PATH}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* hairline centerline */}
        <motion.path
          d={W_PATH}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
          strokeDasharray="5 12"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        />
        {/* travelling light: glow layer + core */}
        {!reduced && (
          <>
            <motion.path
              d={W_PATH}
              stroke="url(#wag-pulse)"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#wag-glow)"
              strokeDasharray={`170 ${W_LENGTH - 170}`}
              initial={{ strokeDashoffset: W_LENGTH }}
              animate={{ strokeDashoffset: -W_LENGTH }}
              transition={{ duration: 4.6, ease: "linear", repeat: Infinity, delay: 1.4 }}
              opacity={0.85}
            />
            <motion.path
              d={W_PATH}
              stroke="url(#wag-pulse)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`170 ${W_LENGTH - 170}`}
              initial={{ strokeDashoffset: W_LENGTH }}
              animate={{ strokeDashoffset: -W_LENGTH }}
              transition={{ duration: 4.6, ease: "linear", repeat: Infinity, delay: 1.4 }}
            />
          </>
        )}
        {reduced && (
          <path
            d={W_PATH}
            stroke="url(#wag-pulse)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`170 ${W_LENGTH - 170}`}
            strokeDashoffset={W_LENGTH * 0.42}
          />
        )}
        {/* the mark's full stop */}
        <motion.circle
          cx="630"
          cy="270"
          r="11"
          fill="#2E8FEF"
          initial={reduced ? undefined : { scale: 0, opacity: 0 }}
          animate={reduced ? undefined : { scale: 1, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * V5 · SIGNAL — the mark IS the hero (Metalab's move), in Charge's world:
 * clean spread menu on top, an abstract WAG monogram that draws itself and
 * carries a travelling headlight pulse, wordmark and magnetic actions below.
 */
export function HeroSignal() {
  return (
    <section className="grain relative isolate flex min-h-svh flex-col overflow-hidden bg-base">
      <div aria-hidden className="nebula-a" />
      <div aria-hidden className="nebula-b" />

      {/* clean chrome, Charge register: mark · spread links · action */}
      <div className="relative z-10 flex items-center justify-between px-[var(--gutter)] py-6">
        <svg viewBox="0 0 660 330" className="h-6 w-auto" aria-hidden>
          <path
            d={W_PATH}
            stroke="white"
            strokeWidth="52"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="630" cy="270" r="26" fill="#2E8FEF" />
        </svg>
        <nav aria-label="Primary (variant demo)" className="hidden gap-12 md:flex">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href} className="type-kicker link-sweep text-mid hover:text-hi">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={nav.cta.href}
          className="type-kicker rounded-full border border-hairline-strong px-5 py-3 text-hi transition-colors duration-[var(--dur-fast)] hover:border-accent-hover hover:text-accent-hover"
        >
          {nav.cta.label}
        </a>
      </div>

      {/* the living mark */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-12 px-[var(--gutter)] py-10">
        <Monogram />
        <div className="text-center">
          <p className="font-grotesk text-xl font-medium uppercase tracking-[0.3em] text-hi md:text-2xl">
            World Automotive Group
          </p>
          <MonoLabel className="mt-4">EST. 1994 · ABU DHABI · UAE + NORTH AMERICA</MonoLabel>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={hero.ctaPrimary.href} solid>
            {hero.ctaPrimary.label}
          </MagneticButton>
          <MagneticButton href={hero.ctaSecondary.href}>{hero.ctaSecondary.label}</MagneticButton>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-[var(--gutter)] pb-8">
        <MonoLabel tone="faint">FASTTRACK · AUTODATA · AXXION · PAG DIRECT</MonoLabel>
        <MonoLabel tone="faint">A SKELMORE COMPANY</MonoLabel>
      </div>
    </section>
  );
}
