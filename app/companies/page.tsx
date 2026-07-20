import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { GridExploreButton } from "@/components/site/CompanyPreview";
import { companies } from "@/content/site";
import "./companies.css";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "The operating companies of World Automotive Group: FastTrack, AutoData, Axxion, PAG Direct and Vicimus. Each runs on its own domain and P&L; the group sets the standard.",
};

// Readable button ink per company hue: white on the deep hues, near-black
// navy on the two light hues (AutoData cyan, Vicimus green) so the label
// always stays legible on its solid button.
const ctaInk: Record<string, string> = {
  fasttrack: "#ffffff",
  autodata: "#02040f",
  axxion: "#ffffff",
  "pag-direct": "#ffffff",
  vicimus: "#02040f",
};

export default function CompaniesPage() {
  return (
    <PageShell>
      <section className="relative px-[var(--gutter)] pb-24 pt-40">
        <Scrim />
        <div className="relative">
          <p data-reveal className="type-kicker text-accent">The Companies</p>
          <h1
            data-reveal
            className="type-display mt-6 max-w-4xl"
            style={{ fontSize: "var(--fs-h1)" }}
          >
            Five companies, one standard.
          </h1>
          <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-mid">
            Each company runs on its own domain and its own P&amp;L. The group
            sets the standard for service, data and retail across MENA and
            North America.
          </p>

          <div className="mt-16 grid gap-px border-y border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <Link
                data-reveal
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="co-tile group relative flex flex-col justify-between bg-[rgba(3,6,20,0.78)] p-8 transition-colors duration-[var(--dur-fast)] hover:bg-[rgba(4,8,28,0.9)]"
                style={{ "--co": c.hue, "--co-ink": ctaInk[c.slug] ?? "#ffffff" } as React.CSSProperties}
              >
                <div>
                  <span aria-hidden className="co-tile-bar" />
                  <h2 className="mt-5 text-xl font-medium text-hi">{c.name}</h2>
                  <p className="mt-3 text-mid">{c.oneLiner}</p>
                </div>
                <div className="co-tile-foot mt-8 flex flex-wrap items-center justify-between gap-4">
                  <span className="type-mono text-faint">{c.chipHint}</span>
                  <GridExploreButton
                    slug={c.slug}
                    name={c.name}
                    hue={c.hue}
                    ink={ctaInk[c.slug]}
                  />
                </div>
              </Link>
            ))}
            {/* Sixth cell: the group standard behind all five companies. */}
            <Link
              data-reveal
              href="/#model"
              className="co-tile co-tile--group group relative flex flex-col justify-between bg-[rgba(3,6,20,0.78)] p-8 transition-colors duration-[var(--dur-fast)] hover:bg-[rgba(4,8,28,0.9)]"
            >
              <div>
                <span aria-hidden className="co-tile-bar" />
                <h2 className="mt-5 text-xl font-medium text-hi">
                  The Group standard
                </h2>
                <p className="mt-3 text-mid">
                  One operating model behind all five companies: build, run,
                  and share what works across the group.
                </p>
              </div>
              <div className="co-tile-foot mt-8 flex flex-wrap items-center justify-between gap-4">
                <span className="type-mono text-faint">the model</span>
                <span className="co-tile-btn co-tile-btn--ghost">
                  See the model →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
