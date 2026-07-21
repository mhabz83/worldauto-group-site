import type { Metadata } from "next";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { ContactForm } from "@/components/site/ContactForm";
import { group } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the World Automotive Group office in Abu Dhabi about partnerships across quick service, vehicle data, claims and retail.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <section className="relative px-[var(--gutter)] pb-24 pt-40">
        <Scrim />
        <div className="relative grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div className="max-w-md">
            <p data-reveal className="type-kicker text-accent">Contact</p>
            <h1
              data-reveal
              className="type-display mt-6 leading-[0.95] text-hi"
              style={{ fontSize: "var(--fs-display)" }}
            >
              Build With{" "}
              <span className="text-highlight">The Group.</span>
            </h1>
            <p data-reveal className="mt-8 text-lg leading-relaxed text-mid">
              From forecourt networks to vehicle data, we build and run
              automotive operations at national scale. Talk to the group office
              in Abu Dhabi.
            </p>

            <div className="mt-12 border-t border-hairline pt-8">
              <p className="type-kicker text-faint">The group office</p>
              <p className="mt-4 text-mid">{group.hq}</p>
              <p className="mt-6 type-kicker text-faint">{group.footprint}</p>
            </div>
          </div>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
