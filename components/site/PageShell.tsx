import { ReactNode } from "react";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/* Legibility scrim: keeps text readable over the moving neon field.
   Same treatment as the homepage sections. */
export function Scrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1]"
      style={{
        background:
          "linear-gradient(90deg, rgba(2,4,15,0.94) 0%, rgba(2,4,15,0.7) 46%, rgba(2,4,15,0.4) 78%, rgba(2,4,15,0.5) 100%)",
      }}
    />
  );
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
