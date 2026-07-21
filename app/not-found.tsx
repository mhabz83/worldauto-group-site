import Link from "next/link";
import { nav } from "@/content/site";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import "./not-found.css";

/* Branded 404: navy field, the wordmark, one plain line, one way home —
   plus a single neon road under the headline that runs off toward the
   horizon and dissolves into nothing. Same world as the homepage, quieter. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-start justify-center overflow-hidden bg-base px-[var(--gutter)]">
      <div className="nf-road" aria-hidden="true">
        <svg
          viewBox="0 0 1440 1000"
          preserveAspectRatio="xMidYMax slice"
          focusable="false"
        >
          <defs>
            <linearGradient id="nf-fade-blue" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0b6fd8" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#0b6fd8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0b6fd8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nf-fade-blue-soft" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0b6fd8" stopOpacity="0.4" />
              <stop offset="45%" stopColor="#0b6fd8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0b6fd8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nf-fade-orange" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ff6340" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ff6340" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ff6340" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="nf-horizon" cx="50%" cy="42%" r="45%">
              <stop offset="0%" stopColor="#0b6fd8" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#0b6fd8" stopOpacity="0" />
            </radialGradient>
            <filter id="nf-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="720" cy="420" rx="520" ry="140" fill="url(#nf-horizon)" />

          <g filter="url(#nf-glow)" fill="none" strokeLinecap="round">
            {/* outer rails, converging then dissolving before they connect */}
            <path d="M-60 1060 L668 424" stroke="url(#nf-fade-blue)" strokeWidth="2.6" />
            <path d="M1500 1060 L772 424" stroke="url(#nf-fade-blue)" strokeWidth="2.6" />
            {/* faint inner lane lines, same dead-end fade */}
            <path d="M280 1060 L700 428" stroke="url(#nf-fade-blue-soft)" strokeWidth="1.2" />
            <path d="M1160 1060 L740 428" stroke="url(#nf-fade-blue-soft)" strokeWidth="1.2" />
            {/* centre dash, energy accent, breaks apart toward the horizon */}
            <path
              d="M720 1060 C702 860 738 640 720 434"
              stroke="url(#nf-fade-orange)"
              strokeWidth="2"
              strokeDasharray="22 30"
            />
          </g>

          {/* the road breaking apart into nothing — a literal dead end */}
          <g filter="url(#nf-glow)">
            <circle cx="706" cy="430" r="2.2" fill="#0b6fd8" opacity="0.55" />
            <circle cx="736" cy="426" r="1.6" fill="#0b6fd8" opacity="0.45" />
            <circle cx="722" cy="440" r="1.3" fill="#ff6340" opacity="0.5" />
            <circle cx="690" cy="446" r="1" fill="#0b6fd8" opacity="0.35" />
            <circle cx="752" cy="444" r="1" fill="#0b6fd8" opacity="0.3" />
            <circle cx="718" cy="418" r="0.9" fill="#ff6340" opacity="0.3" />
          </g>
        </svg>
      </div>

      <div className="nf-content flex flex-col items-start">
        <span className="wag-wordmark mb-10" aria-label="WORLDAUTO GROUP">
          <strong>
            WORLD<span>AUTO</span>
          </strong>
          <span>{nav.wordmark.thin}</span>
        </span>
        <MonoLabel tone="faint" className="mb-8">
          404 · PAGE NOT FOUND
        </MonoLabel>
        <h1 className="type-editorial max-w-[16ch]">
          This road doesn&apos;t <em className="serif-italic">exist.</em>
        </h1>
        <Link
          href="/"
          className="type-kicker link-sweep mt-12 text-accent-hover"
        >
          Back to the homepage →
        </Link>
      </div>
    </main>
  );
}
