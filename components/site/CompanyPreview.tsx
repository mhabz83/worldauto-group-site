"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import "./company-preview.css";

/* Short preview copy for each company. Every line is a re-expression of a
   fact already published on that company's page (content/site.ts) — no new
   or unverified claims. Vicimus stays group-level only: capability words,
   never client counts. */
const PREVIEW: Record<string, { descriptor: string; highlights: string[] }> = {
  fasttrack: {
    descriptor: "Quick vehicle service on UAE fuel forecourts.",
    highlights: ["32 centres", "Since 2004", "United Arab Emirates"],
  },
  autodata: {
    descriptor: "Bank-grade vehicle intelligence.",
    highlights: ["Valuations", "Inspections", "Vehicle history"],
  },
  axxion: {
    descriptor: "The UAE's first motor-claims administrator.",
    highlights: ["First motor-claims TPA", "Approved-workshop network"],
  },
  "pag-direct": {
    descriptor: "Automotive retail across Ontario, Canada.",
    highlights: ["2 Hyundai dealerships", "30+ years", "Ontario, Canada"],
  },
  vicimus: {
    descriptor: "The group's automotive software engine.",
    highlights: ["Retention", "Intent mining", "Lifecycle CRM"],
  },
};

type PreviewMeta = { slug: string; name: string; hue: string };

type Pos = { top: number; left: number };

const OFFSCREEN: Pos = { top: -9999, left: -9999 };

/* Client-only flag without a setState-in-effect: the portal target
   (document.body) does not exist during SSR, so render nothing on the server
   and after the first client render switch on. */
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* Shared reveal state + edge-aware placement. The popup is position: fixed and
   its coordinates are computed from the trigger's viewport rect at show time,
   so it can flip above/below and shift horizontally to stay on screen, and it
   escapes any panel mask or overflow clip. */
function usePreview() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<"above" | "below">("above");
  const [pos, setPos] = useState<Pos>(OFFSCREEN);
  const mounted = useMounted();

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const show = useCallback(() => {
    if (!canHover()) return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const a = wrap.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const gap = 12;
    const margin = 8;
    const vw = window.innerWidth;
    const above = a.top > ch + gap + margin;
    const top = above ? a.top - gap - ch : a.bottom + gap;
    let left = a.left + a.width / 2 - cw / 2;
    left = Math.max(margin, Math.min(left, vw - margin - cw));
    setPlace(above ? "above" : "below");
    setPos({ top, left });
    setOpen(true);
  }, []);

  const hide = useCallback(() => setOpen(false), []);

  return { wrapRef, cardRef, open, place, pos, mounted, show, hide };
}

function PreviewPop({
  meta,
  cardRef,
  open,
  place,
  pos,
  mounted,
}: {
  meta: PreviewMeta;
  cardRef: React.Ref<HTMLDivElement>;
  open: boolean;
  place: "above" | "below";
  pos: Pos;
  mounted: boolean;
}) {
  const data = PREVIEW[meta.slug];
  if (!data || !mounted) return null;
  /* Portal to <body>: the CTAs live inside GSAP-transformed ancestors, and a
     transformed ancestor becomes the containing block for position: fixed —
     which would offset the popup by the ancestor's transform. Rendering at the
     document root keeps "fixed" truly viewport-relative. */
  return createPortal(
    <div
      className="cta-pv-pop"
      data-place={place}
      data-open={open ? "true" : "false"}
      style={{ top: pos.top, left: pos.left } as CSSProperties}
      aria-hidden="true"
    >
      <div
        className="cta-pv-card"
        ref={cardRef}
        style={{ "--co": meta.hue } as CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- small
            decorative thumbnail, native lazy-load, no layout role */}
        <img
          className="cta-pv-thumb"
          src={`/images/company-previews/${meta.slug}.webp`}
          alt=""
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
        />
        <span className="cta-pv-name">{meta.name}</span>
        <span className="cta-pv-desc">{data.descriptor}</span>
        <span className="cta-pv-facts">
          {data.highlights.map((h) => (
            <span key={h} className="cta-pv-fact">
              {h}
            </span>
          ))}
        </span>
        <span className="cta-pv-go">View full page →</span>
      </div>
    </div>,
    document.body,
  );
}

/* Homepage journey company stop: the trigger IS the button link. */
export function JourneyExploreLink({
  href,
  className,
  style,
  slug,
  name,
  hue,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  slug: string;
  name: string;
  hue: string;
  children: ReactNode;
}) {
  const { wrapRef, cardRef, open, place, pos, mounted, show, hide } =
    usePreview();
  return (
    <span className="cta-pv-wrap" ref={wrapRef}>
      <Link
        href={href}
        className={className}
        style={style}
        data-co={slug}
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </Link>
      <PreviewPop
        meta={{ slug, name, hue }}
        cardRef={cardRef}
        open={open}
        place={place}
        pos={pos}
        mounted={mounted}
      />
    </span>
  );
}

/* /companies grid tile: the whole tile is the link, so the trigger is the
   button span (mouse) plus the tile link's own focus (keyboard). */
export function GridExploreButton({
  slug,
  name,
  hue,
  ink,
}: {
  slug: string;
  name: string;
  hue: string;
  ink?: string;
}) {
  const { wrapRef, cardRef, open, place, pos, mounted, show, hide } =
    usePreview();

  useEffect(() => {
    const link = wrapRef.current?.closest("a");
    if (!link) return;
    link.addEventListener("focus", show);
    link.addEventListener("blur", hide);
    return () => {
      link.removeEventListener("focus", show);
      link.removeEventListener("blur", hide);
    };
  }, [wrapRef, show, hide]);

  return (
    <span
      className="cta-pv-wrap"
      ref={wrapRef}
      onPointerEnter={show}
      onPointerLeave={hide}
    >
      <span
        className="co-tile-btn"
        data-co={slug}
        style={{ "--co-ink": ink ?? "#ffffff" } as CSSProperties}
      >
        Explore {name} →
      </span>
      <PreviewPop
        meta={{ slug, name, hue }}
        cardRef={cardRef}
        open={open}
        place={place}
        pos={pos}
        mounted={mounted}
      />
    </span>
  );
}
