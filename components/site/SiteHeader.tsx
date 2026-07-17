import Link from "next/link";
import { nav } from "@/content/site";
import { SiteHeaderMenu } from "@/components/site/SiteHeaderMenu";

/* Shared top chrome for inner pages. Same wordmark lockup, kicker links and
   orange CTA as the homepage header; internal routes use next/link. */
export function SiteHeader() {
  return (
    <header className="header-fade fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-[var(--gutter)] py-5 md:gap-6">
      <Link href="/" className="wag-wordmark" aria-label="WORLDAUTO GROUP home">
        <strong>
          WORLD<span>AUTO</span>
        </strong>
        <span>GROUP</span>
      </Link>
      <nav className="hidden gap-10 md:flex" aria-label="Primary">
        {nav.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="type-kicker link-sweep text-mid hover:text-hi"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href={nav.cta.href}
          className="site-header-cta whitespace-nowrap rounded-[4px] bg-highlight px-5 py-3 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]"
        >
          {nav.cta.label}
        </Link>
        <SiteHeaderMenu />
      </div>
    </header>
  );
}
