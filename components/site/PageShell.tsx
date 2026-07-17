import { ReactNode } from "react";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/* Legibility scrim: keeps text readable over the neon field.
   Layered treatment defined in globals.css (.page-scrim). */
export function Scrim() {
  return <div aria-hidden className="page-scrim" />;
}

/* Shared page frame for inner pages: neon background + header + footer.
   Content is passed as children and rendered above the field. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroBackdrop />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
