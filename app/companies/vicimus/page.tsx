import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { VicimusNetworkPlate } from "@/components/blocks/VicimusNetworkPlate";
import { companies } from "@/content/site";
import { ChapterRail } from "./ChapterRail";
import { Reveals } from "./Reveals";
import "../companies.css";
import "./vicimus.css";

/* Vicimus model page: built to the AutoData standard and grammar (numbered
   chapters, a left progress rail, alternating dark/light slides, keyline media
   plates), but it is Vicimus's own page, not a recolour. The hero is the
   group's own Madar neon render, lifted and graded to Vicimus green. Both
   product plates are real captures of the Vicimus platform, cleaned and framed.
   The third chapter is a horizontal ownership-journey band, its own device.
   Every claim traces to vicimus.com or the group's approved copy; positioning
   is group-level only, with no client counts or client names. */

const company = companies.find((c) => c.slug === "vicimus")!;
const next = companies[(companies.findIndex((c) => c.slug === "vicimus") + 1) % companies.length];

export const metadata: Metadata = {
  title: company.name,
  description: company.oneLiner,
};

export default function VicimusPage() {
  return (
    <PageShell hue={company.hue}>
      <div className="co-page vc-page" style={{ "--co": company.hue } as React.CSSProperties}>
        <Reveals />

        {/* S0 · Hero: the green-graded Madar neon render, full bleed under our
            navy tint. Its routing lines between floating cards read as a
            dealership's data moving between departments. Title lockup sits
            low-left; the fold carries one action and one real proof line. */}
        <section className="vc-hero">
          <div className="vc-hero-bg" aria-hidden>
            <Image
              className="hidden md:block"
              src="/images/vicimus/vicimus-neon-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <Image
              className="md:hidden"
              src="/images/vicimus/vicimus-neon-hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="vc-hero-tint" />
          </div>

          <div className="vc-hero-content">
            <Link href="/companies" className="type-kicker link-sweep text-mid hover:text-hi">
              ← All companies
            </Link>

            <div className="vc-hero-foot">
              <p className="co-kicker">Operating company · {company.region}</p>
              <div className="vc-hero-rule" aria-hidden />
              <h1 className="type-display vc-hero-title">Vicimus</h1>
              <p className="vc-hero-signal">
                The next sale is often{" "}
                <span className="co-signal">already in the data</span>.
              </p>
              <p className="vc-hero-sub">
                Vicimus is the group&apos;s software engine for car retail. It reads a
                dealer&apos;s own sales and service records to find who is due for a
                visit and who is ready to move up, then reaches them by email, text,
                mail and social.
              </p>
              <div className="vc-hero-action">
                <Link href="/contact" className="vc-btn vc-btn--solid">
                  Book a demo
                </Link>
                <p className="vc-hero-proof">
                  One platform across every part of the store: sales, service,
                  finance, parts and the front desk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters: three numbered slides, dark / light / dark, with the left
            rail as the single progress index. Each carries its own
            composition. Native scroll, no hijack. */}
        <div id="vc-chapters" className="vc-chapters">
          <ChapterRail />

          {/* 01 · Retention, dark, image-forward: a narrow copy column at the
              left, the real targeting screen running large to the right edge. */}
          <section id="retention" className="vc-ch vc-ch--dark vc-ch--01">
            <div className="vc-ch-inner vc-ch-inner--bleed">
              <div className="vc-ch-copy" data-adr>
                <h2 className="type-display vc-ch-title">Retention</h2>
                <p className="vc-ch-lead">The people a dealer already knows.</p>
                <p className="vc-ch-body">
                  Vicimus sorts and filters a store&apos;s own records to find past
                  buyers and service visitors, and picks out the ones showing signs
                  they are ready to come back. Those drivers hear from the dealer
                  first, before they wander out to someone else, with a message
                  matched to where they are. Each one is personal, and every reply
                  is written back to the same record so the picture stays current.
                </p>
              </div>
              <figure className="vc-plate vc-plate--bleed" data-adr>
                <div className="vc-frame">
                  <div className="vc-browser">
                    <div className="vc-browser-label" aria-hidden>
                      Vicimus · campaign targeting
                    </div>
                    <Image
                      src="/images/vicimus/ui-retention-targeting.png"
                      alt="Vicimus campaign targeting screen with filters for recent purchase, customer type, equity position and campaign scale"
                      width={1800}
                      height={758}
                    />
                  </div>
                </div>
                <figcaption className="vc-caption">
                  <span aria-hidden />
                  Choosing exactly who a campaign should reach
                </figcaption>
              </figure>
            </div>
          </section>

          {/* 02 · Intelligence, light, media-led: the wide reporting board runs
              large on the LEFT with copy to its right, over Madar's own light
              streaks. Opposite side and opposite tone to Ch01. */}
          <section id="intelligence" className="vc-ch vc-ch--light ui-light vc-ch--02">
            <div className="vc-ch-bg" aria-hidden>
              <Image src="/images/vicimus/madar-light-streaks.webp" alt="" fill sizes="100vw" />
            </div>
            <div className="vc-ch-inner vc-ch-inner--media-left">
              <figure className="vc-plate" data-adr>
                <div className="vc-frame vc-frame--light">
                  <div className="vc-browser">
                    <div className="vc-browser-label" aria-hidden>
                      Bumper BI · dealership reporting
                    </div>
                    <Image
                      src="/images/vicimus/ui-bi-reporting.png"
                      alt="Vicimus Bumper BI reporting board showing new retail model mix, unit trend against plan and sales-person performance tables"
                      width={1800}
                      height={684}
                    />
                  </div>
                </div>
                <figcaption className="vc-caption">
                  <span aria-hidden />
                  One connected view across the store
                </figcaption>
              </figure>
              <div className="vc-ch-copy" data-adr>
                <h2 className="type-display vc-ch-title">Intelligence</h2>
                <p className="vc-ch-lead">The whole store in one clear view.</p>
                <p className="vc-ch-body">
                  Bumper BI pulls sales, service, parts and inventory into a single
                  report. The numbers are put on the same footing, trended over time
                  and tied back to the department, the role and the month they belong
                  to. A manager can see what is really happening and who owns it. It
                  is built for car retail, not borrowed from another trade.
                </p>
              </div>
            </div>
          </section>

          {/* 03 · The journey, dark, text-forward: a centred statement over one
              horizontal ownership-journey line. No product capture here; the
              breadth is drawn as five green stages, the page's own device. */}
          <section id="journey" className="vc-ch vc-ch--dark vc-ch--03">
            <div className="vc-ch-inner vc-ch-inner--stack">
              <div className="vc-ch-copy vc-ch-copy--center" data-adr>
                <h2 className="type-display vc-ch-title">The whole journey</h2>
                <p className="vc-ch-lead">From first contact to the next car.</p>
                <p className="vc-ch-body vc-ch-body--wide">
                  Retention and reporting are two parts of a wider platform that
                  follows a driver through the whole life of the car. It wins new
                  buyers, carries them through finance and add-ons at the counter,
                  tracks and answers the calls, runs the dealer&apos;s website, and
                  brings them back when the time comes. Winning new business and
                  keeping the old, joined up across every part of the store.
                </p>
              </div>
              <figure className="vc-plate" data-adr>
                <div className="vc-journey-wrap">
                  <ol className="vc-journey">
                    <li>
                      <span className="vc-journey-tick" aria-hidden />
                      <h3>Conquest</h3>
                      <p>Automated inventory ads put the right cars in front of new buyers on social and search.</p>
                    </li>
                    <li>
                      <span className="vc-journey-tick" aria-hidden />
                      <h3>Showroom</h3>
                      <p>A managed dealer website and tidy lead handling carry that interest through to the floor.</p>
                    </li>
                    <li>
                      <span className="vc-journey-tick" aria-hidden />
                      <h3>Counter</h3>
                      <p>Finance and accessories are made simple to present, so more is offered and more is taken up.</p>
                    </li>
                    <li>
                      <span className="vc-journey-tick" aria-hidden />
                      <h3>Service</h3>
                      <p>Calls are tracked and answered, and service visitors are kept close between appointments.</p>
                    </li>
                    <li>
                      <span className="vc-journey-tick" aria-hidden />
                      <h3>Return</h3>
                      <p>When a car is due or a driver is ready, the dealer reaches them before anyone else does.</p>
                    </li>
                  </ol>
                </div>
                <p className="vc-journey-note">One customer, followed the whole way round</p>
              </figure>
            </div>
          </section>
        </div>

        {/* Group-level motif band: the network-of-dealerships data-flow plate,
            reused here as the one full-bleed beat. No photography at group
            level, no client marks, no figures. */}
        <section className="vc-band" aria-label="Vicimus at group level">
          <VicimusNetworkPlate />
          <div className="vc-band-inner">
            <p className="co-kicker">Built and run at group level</p>
            <p className="vc-band-line">
              Many stores, one <b>engine</b> feeding the group.
            </p>
          </div>
        </section>

        {/* Standing: how it is built and how it is run. Real, group-safe facts
            in place of AutoData's awards column; no client names, no counts. */}
        <section className="vc-standing" aria-label="How Vicimus is built and run">
          <div className="vc-standing-inner">
            <div data-adr>
              <p className="co-kicker">Built and run</p>
              <h2 className="type-display vc-standing-title">
                Made for car retail,<br />run by people
              </h2>
            </div>
            <div className="vc-standing-cols">
              <div data-adr>
                <h3 className="vc-standing-h">How it is built</h3>
                <ul className="vc-built-list">
                  <li>
                    <strong>Made for car retail.</strong>
                    The platform is built for showrooms, not adapted from a tool
                    meant for another trade.
                  </li>
                  <li>
                    <strong>One record per customer.</strong>
                    Every message and result is written back to the same record, so
                    the data stays current and each contact stays personal.
                  </li>
                  <li>
                    <strong>Careful with contact.</strong>
                    Texting follows each customer&apos;s own choice to opt in, taken
                    straight from the dealer&apos;s own system.
                  </li>
                </ul>
              </div>
              <div data-adr>
                <h3 className="vc-standing-h">How it is run</h3>
                <p className="vc-standing-lead">
                  Vicimus is run by people, not left to run itself. A store works with
                  the same team and sits down with them each month to set the plan and
                  read the results.
                </p>
                <ul className="vc-standing-list">
                  <li>
                    <strong>Hands-on management.</strong> A dedicated team plans the
                    campaigns, watches the numbers and adjusts as they go.
                  </li>
                  <li>
                    <strong>Kept deliberately small.</strong> The number of stores a
                    team looks after is held down on purpose, so the attention stays
                    high.
                  </li>
                  <li>
                    <strong>Part of World Automotive Group.</strong> Vicimus is the
                    group&apos;s software engine, built and run at group level.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Closing call to action. Orange stays the action colour. */}
        <section className="relative px-[var(--gutter)] py-24">
          <Scrim />
          <div className="relative max-w-4xl">
            <p data-adr className="co-kicker">Start here</p>
            <p data-adr className="vc-close-line">Put your own data to work.</p>
            <p data-adr className="vc-close-body">
              Tell us what you want more of, whether that is repeat service, upgrades
              or new buyers. We will show you where it already sits in your numbers.
            </p>
            <div data-adr className="vc-cta-row">
              <Link href="/contact" className="vc-btn vc-btn--solid">
                Book a demo
              </Link>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="vc-btn vc-btn--ghost"
              >
                Visit {company.urlLabel} ↗
              </a>
            </div>
            <p data-adr className="vc-contact">
              Vicimus. North America. Call 888 301 6178. vicimus.com.
            </p>
          </div>
        </section>

        {/* Next company: previews the next hue before you get there. */}
        <section className="relative px-[var(--gutter)] pb-16">
          <Scrim />
          <div className="relative max-w-4xl">
            <Link
              href={`/companies/${next.slug}`}
              className="co-next"
              style={{ "--co-next": next.hue } as React.CSSProperties}
            >
              <span>
                <span className="co-next-kicker type-kicker block">Next company</span>
                <span className="co-next-name mt-2 block">{next.name}</span>
              </span>
              <span aria-hidden className="co-next-arrow">→</span>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
