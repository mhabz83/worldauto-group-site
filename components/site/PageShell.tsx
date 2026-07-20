import { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/* Legibility scrim: keeps text readable over the neon field.
   Layered treatment defined in globals.css (.page-scrim). */
export function Scrim() {
  return <div aria-hidden className="page-scrim" />;
}

/* Fixed neon field behind the inner pages: navy base, a glow, a horizon
   line and a perspective floor, all tinted by --field-hue. Replaces the
   recycled neon-SUV plate (that artwork now belongs to the homepage only).
   Styles live in globals.css (.neon-field). */
function NeonField({ hue }: { hue?: string }) {
  return (
    <div
      aria-hidden
      className="neon-field"
      style={hue ? ({ "--field-hue": hue } as React.CSSProperties) : undefined}
    />
  );
}

/* Shared page frame for inner pages: neon field + header + footer.
   Company pages pass their hue so the whole field takes their colour. */
export function PageShell({ children, hue }: { children: ReactNode; hue?: string }) {
  return (
    <>
      <NeonField hue={hue} />
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
