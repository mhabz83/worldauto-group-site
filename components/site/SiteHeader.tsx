import Link from "next/link";
import { nav } from "@/content/site";

/* Shared top chrome for inner pages. Matches the homepage header:
   wordmark left, nav centre-right, orange CTA. Internal routes use next/link. */
export function SiteHeader() {
  return (
    <header className="header-fade fixed inset-x-0 top-0 z-20 flex items-center justify-between px-[var(--gutter)] py-6">
      <Link href="/" className="text-lg uppercase tracking-[0.28em] text-hi">
        <span className="font-medium">WorldAuto</span>{" "}
        <span className="text-mid">Group</span>
      </Link>
      <nav className="hidden gap-10 md:flex">
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
      <Link
        href={nav.cta.href}
        className="rounded-[4px] bg-highlight px-5 py-3 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]"
      >
        {nav.cta.label}
      </Link>
    </header>
  );
}
