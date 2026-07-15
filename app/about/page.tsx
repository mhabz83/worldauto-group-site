import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { group } from "@/content/site";
import { model, heritage } from "@/content/home";
import { LeadershipGrid } from "@/components/site/LeadershipGrid";

export const metadata: Metadata = {
  title: "The Group",
  description:
    "World Automotive Group is the automotive arm of Skelmore, founded 1994 in Abu Dhabi. We build and run automotive operations across the UAE and North America, then productize what works.",
};

const groupStats = [
  ["1994", "Founded, Abu Dhabi"],
  ["~USD 650M", "Annual group revenue"],
  ["~4,000", "People across the group"],
  ["UAE · NA", "Two operating regions"],
];

export default function AboutPage() {
  return (
    <PageShell>
      {/* INTRO */}
      <section className="relative px-[var(--gutter)] pb-20 pt-40">
        <Scrim />
        <div className="relative max-w-4xl">
          <p data-reveal className="type-kicker text-accent">The Group</p>
          <h1
            data-reveal
            className="mt-6 font-light leading-[0.95] text-hi"
            style={{ fontSize: "var(--fs-display)" }}
          >
            One Operator,<br />
            <span className="text-highlight">Many Engines.</span>
          </h1>
          <p data-reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-mid">
            {group.name} is the automotive arm of {group.parent.name}, a private
            group founded in {group.parent.founded}. We build and run automotive
            operations across the UAE and North America, then productize what
            works. {model.intro}
          </p>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="relative px-[var(--gutter)] py-16">
        <Scrim />
        <div className="relative">
          <p className="type-kicker text-accent">The group in numbers</p>
          <div className="mt-12 grid gap-px border-y border-hairline sm:grid-cols-2 lg:grid-cols-4">
            {groupStats.map(([v, l]) => (
              <div data-reveal key={l} className="py-10 pr-8">
                <p className="font-light text-hi" style={{ fontSize: "var(--fs-h2)" }}>
                  {v}
                </p>
                <p className="mt-3 type-kicker text-mid">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE MODEL */}
      <section className="relative px-[var(--gutter)] py-16">
        <Scrim />
        <div className="relative">
          <p className="type-kicker text-accent">The model</p>
          <h2
            className="mt-6 max-w-3xl font-light leading-[1.02] text-hi"
            style={{ fontSize: "var(--fs-h1)" }}
          >
            {model.heading}
          </h2>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {model.pillars.map((p) => (
              <div data-reveal key={p.number} className="max-w-md border-t border-hairline pt-6">
                <p className="type-kicker text-highlight">{p.number}</p>
                <h3 className="mt-3 text-xl font-medium text-hi">{p.name}</h3>
                <p className="mt-2 text-mid">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section className="relative px-[var(--gutter)] py-16">
        <Scrim />
        <div className="relative">
          <p className="type-kicker text-accent">Heritage</p>
          <h2
            className="mt-6 max-w-3xl font-light leading-[1.02] text-hi"
            style={{ fontSize: "var(--fs-h1)" }}
          >
            {heritage.heading}
          </h2>
          <div className="mt-14 max-w-3xl">
            {heritage.rows.map((row) => (
              <div
                data-reveal
                key={row.year}
                className="grid grid-cols-[7rem_1fr] gap-6 border-t border-hairline py-6"
              >
                <p className="type-kicker text-highlight">{row.year}</p>
                <div>
                  <h3 className="text-lg font-medium text-hi">{row.title}</h3>
                  <p className="mt-1 text-mid">{row.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="relative px-[var(--gutter)] py-16">
        <Scrim />
        <div className="relative">
          <p className="type-kicker text-accent">Leadership</p>
          <h2
            className="mt-6 max-w-3xl font-light leading-[1.02] text-hi"
            style={{ fontSize: "var(--fs-h1)" }}
          >
            The people behind the group.
          </h2>
          <LeadershipGrid />
        </div>
      </section>

      {/* OFFICE / CTA */}
      <section className="relative px-[var(--gutter)] py-20">
        <Scrim />
        <div className="relative max-w-3xl">
          <p className="type-kicker text-accent">The group office</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mid">
            The group is directed from {group.hq}.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-[4px] bg-highlight px-7 py-4 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]"
          >
            Talk to the group office →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
