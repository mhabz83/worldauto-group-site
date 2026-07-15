import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "The operating companies of World Automotive Group: FastTrack, AutoData, Axxion, PAG Direct and Vicimus. Each runs on its own domain and P&L; the group sets the standard.",
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
            className="mt-6 max-w-4xl font-light leading-[1.02] text-hi"
            style={{ fontSize: "var(--fs-h1)" }}
          >
            {companies.length} companies, one standard.
          </h1>
          <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-mid">
            Each company runs on its own domain and its own P&amp;L. The group
            sets the standard for service, data and retail across the UAE and
            North America.
          </p>

          <div className="mt-16 grid gap-px border-y border-hairline sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c, i) => (
              <Link
                data-reveal
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="group relative flex flex-col justify-between bg-[rgba(2,4,15,0.35)] p-8 transition-colors duration-[var(--dur-fast)] hover:bg-[rgba(2,4,15,0.6)]"
              >
                <div>
                  <p className="type-kicker text-highlight">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-xl font-medium text-hi">{c.name}</h2>
                  <p className="mt-3 text-mid">{c.oneLiner}</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="type-mono text-faint">{c.chipHint}</span>
                  <span className="type-kicker text-mid transition-colors group-hover:text-highlight">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
