import Link from "next/link";
import { nav } from "@/content/site";
import { SiteHeaderMenu } from "@/components/site/SiteHeaderMenu";

/* Shared top chrome for inner pages: the same journey header as the
   homepage (canonical design), on a solid navy bar because inner pages
   have no hero for the gradient to sit over. */
export function SiteHeader() {
  return (
    <header className="journey-header journey-header--solid">
      <Link href="/" className="wag-wordmark journey-wordmark" aria-label="WORLDAUTO GROUP home">
        <strong>
          WORLD<span>AUTO</span>
        </strong>
        <span>{nav.wordmark.thin}</span>
      </Link>
      <nav className="journey-desktop-nav" aria-label="Primary">
        {nav.links.slice(0, 5).map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href={nav.cta.href} className="journey-header-cta">
        {nav.cta.label}
      </Link>
      <SiteHeaderMenu />
    </header>
  );
}
