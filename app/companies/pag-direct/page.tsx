import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";
import { ChapterRail } from "./ChapterRail";
import { Reveals } from "./Reveals";
import "../companies.css";
import "./pag-direct.css";

/* PAG Direct model page: built to the AutoData standard but as its own page,
   not a recolour. Bones borrowed from the shared company-page grammar
   (numbered chapters, a left progress rail, framed real-product plates, the
   ops count band, an editorial standing beat). Skin is PAG Direct's violet
   (#8A6CFF) on WAG navy. The hero artwork is the group's own Madar neon
   render, lifted and graded toward the violet against our navy, not recreated.
   Product plates are real captures from pagdirect.com, cropped and framed.

   Where it diverges from AutoData so it reads as its own page: Ch01 is dark
   and dense (the live shopping tool bleeds off the right), Ch02 is a LIGHT
   slide carrying a DARK plate (the spec record, inverted on paper), and Ch03
   is a quiet type-only band with no plate at all. Every claim traces to
   pagdirect.com's own About Us, Why Buy, Dealerships and Core Values pages;
   the site's stale "5 dealerships / London / Lexus" boilerplate is not used. */

const company = companies.find((c) => c.slug === "pag-direct")!;
const next = companies[(companies.findIndex((c) => c.slug === "pag-direct") + 1) % companies.length];

export const metadata: Metadata = {
  title: company.name,
  description: company.oneLiner,
};

export default function PagDirectPage() {
  return (
    <PageShell hue={company.hue}>
      <div className="co-page pd-page" style={{ "--co": company.hue } as React.CSSProperties}>
        <Reveals />

        {/* S0 · Hero: the Madar neon render graded to violet, full bleed under
            a navy tint. The lockup sits low-left; the render breathes right. */}
        <section className="pd-hero">
          <div className="pd-hero-bg" aria-hidden>
            <Image
              className="hidden md:block"
              src="/images/pag-direct/madar-neon-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <Image
              className="md:hidden"
              src="/images/pag-direct/madar-neon-hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="pd-hero-tint" />
          </div>

          <div className="pd-hero-content">
            <Link href="/companies" className="type-kicker link-sweep text-mid hover:text-hi">
              ← All companies
            </Link>

            <div className="pd-hero-foot">
              <p className="co-kicker">Operating company · {company.region}</p>
              <div className="pd-hero-rule" aria-hidden />
              <h1 className="type-display pd-hero-title">PAG Direct</h1>
              <p className="pd-hero-signal">
                New and used cars, bought <span className="co-signal">your way</span>.
              </p>
              <p className="pd-hero-sub">
                PAG Direct sells and services Hyundai and Toyota across the
                Greater Toronto Area, in the showroom or entirely online. It was
                born more than 30 years ago as the Phaeton Automotive Group.
              </p>
              <div className="pd-hero-action">
                <Link href="/contact" className="pd-btn pd-btn--solid">
                  Get in touch
                </Link>
                <p className="pd-hero-proof">
                  Three dealerships in the Greater Toronto Area. A Great Place to
                  Work Certified company.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters: 01 dark and dense · 02 light with a dark plate · 03 quiet
            type. The left rail is the single running index. Native scroll. */}
        <div id="pd-chapters" className="pd-chapters">
          <ChapterRail />

          {/* 01 · Shop online — dark, image-forward: a narrow copy column at the
              left, the live shopping tool running large and off the right edge. */}
          <section id="shop-online" className="pd-ch pd-ch--dark pd-ch--01">
            <div className="pd-ch-inner pd-ch-inner--bleed">
              <div className="pd-ch-copy" data-pdr>
                <h2 className="type-display pd-ch-title">Shop online</h2>
                <p className="pd-ch-lead">Buy a car without leaving the kitchen table.</p>
                <p className="pd-ch-body">
                  Browse the live inventory and filter it by type, year, make and
                  model. Book a video chat to see a car&apos;s features and
                  condition for yourself. A sales consultant walks you through the
                  financing with no pressure, you leave your deposit online, and
                  you send your current car&apos;s details for a trade-in
                  appraisal with no obligation. Then collect the car at a
                  dealership, or have it delivered to your door.
                </p>
              </div>
              <figure className="pd-plate pd-plate--bleed" data-pdr>
                <div className="pd-frame">
                  <div className="pd-shot">
                    <div className="pd-shot-label" aria-hidden>
                      Shop Online · Inventory
                    </div>
                    <Image
                      src="/images/pag-direct/ui-inventory.webp"
                      alt="PAG Direct online inventory: a results count, type, year, make and model filters, price, mileage and year sliders, and a row of vehicle cards"
                      width={1256}
                      height={648}
                    />
                  </div>
                </div>
                <figcaption className="pd-caption">
                  <span aria-hidden />
                  The live inventory, filtered by type, year, make and model
                </figcaption>
              </figure>
            </div>
          </section>

          {/* 02 · Certified — light slide, dark plate: the spec record inverts
              onto paper. Plate sits left in-column (clearing the rail); copy
              right. Its own column ratio and its own entrance. */}
          <section id="certified" className="pd-ch pd-ch--light ui-light pd-ch--02">
            <div className="pd-ch-inner pd-ch-inner--split">
              <figure className="pd-plate pd-plate--dark" data-pdr>
                <div className="pd-frame pd-frame--onlight">
                  <div className="pd-shot pd-shot--dark">
                    <div className="pd-shot-label" aria-hidden>
                      Vehicle Record · Overview
                    </div>
                    <Image
                      src="/images/pag-direct/ui-spec-record.webp"
                      alt="A PAG Direct vehicle record: an overview grid listing year, make, model, trim, VIN, category, colours, engine, horsepower, fuel, drivetrain and mileage"
                      width={1044}
                      height={552}
                    />
                  </div>
                </div>
                <figcaption className="pd-caption pd-caption--ink">
                  <span aria-hidden />
                  Every car documented down to the VIN
                </figcaption>
              </figure>
              <div className="pd-ch-copy" data-pdr>
                <h2 className="type-display pd-ch-title">Certified</h2>
                <p className="pd-ch-lead">Every car earns the badge before it is sold.</p>
                <p className="pd-ch-body">
                  Each vehicle goes through a full multi-point inspection to reach
                  the PAG Direct Certified standard, which meets or exceeds the
                  manufacturer&apos;s own requirements. Every car is bought with a
                  7 day or 1500 km exchange program. Where a car also qualifies for
                  a manufacturer program, Hyundai H Promise or Toyota Certified, the
                  buyer receives coverage of equal or greater value.
                </p>
              </div>
            </div>
          </section>

          {/* 03 · Service — quiet, type only, no plate. Lower density than 01
              and 02: a centred statement, two short stanzas and one action. */}
          <section id="service" className="pd-ch pd-ch--dark pd-ch--03">
            <div className="pd-ch-inner pd-ch-inner--quiet" data-pdr>
              <p className="co-kicker">After you drive off</p>
              <h2 className="type-display pd-ch-title pd-ch-title--center">Service and parts</h2>
              <p className="pd-ch-lead pd-ch-lead--center">
                The relationship starts at handover. It does not end there.
              </p>
              <div className="pd-stanzas">
                <p>
                  <strong>Service.</strong> Factory-trained technicians handle
                  regular maintenance and warranty work at all three dealerships.
                </p>
                <p>
                  <strong>Parts.</strong> Parts teams fit genuine manufacturer
                  parts and quality aftermarket accessories, whichever suits the
                  car and the budget.
                </p>
              </div>
              <div className="pd-service-book">
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-btn pd-btn--ghost"
                >
                  Book a service appointment ↗
                </a>
                <p className="pd-service-note">
                  Book online and the confirmation lands on your phone.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* S4 · Ops band: the one photographic beat, washed violet, carrying
            the count of dealerships. */}
        <section className="co-ops" aria-label="PAG Direct footprint">
          <Image
            className="co-ops-img"
            src="/images/hero-interchange-night.png"
            alt="A highway interchange at night with streams of vehicle lights"
            fill
            sizes="100vw"
          />
          <div aria-hidden className="co-ops-tint" />
          <div className="co-ops-inner">
            <p className="co-kicker">Retail across the Greater Toronto Area</p>
            <p className="co-count">
              <span className="co-count-value">3</span>
              <span className="co-count-label">
                dealerships carrying Hyundai and Toyota, in the showroom and online
              </span>
            </p>
          </div>
        </section>

        {/* Standing: what guides the work and where PAG Direct comes from.
            Real, named values and the named dealership roster; no invented
            figures and no prices. */}
        <section className="pd-standing" aria-label="PAG Direct standing">
          <div className="pd-standing-inner">
            <div className="pd-standing-head" data-pdr>
              <p className="co-kicker">Where PAG Direct comes from</p>
              <h2 className="type-display pd-standing-title">
                Thirty years<br />in the trade
              </h2>
            </div>
            <div className="pd-standing-cols">
              <div data-pdr>
                <h3 className="pd-standing-h">What guides the work</h3>
                <ul className="pd-value-list">
                  <li>
                    <span className="pd-value-name">Automotive retail innovation</span>
                    <p>New online tools and welcoming showrooms, always being rethought.</p>
                  </li>
                  <li>
                    <span className="pd-value-name">People investment</span>
                    <p>The best people hired, developed and kept, in a culture worth staying for.</p>
                  </li>
                  <li>
                    <span className="pd-value-name">Experiential excellence</span>
                    <p>The cars are exceptional; the experience around them is what sets PAG Direct apart.</p>
                  </li>
                  <li>
                    <span className="pd-value-name">Integrity and transparency</span>
                    <p>Promises kept, every conversation clear, and ownership taken when something slips.</p>
                  </li>
                </ul>
              </div>
              <div className="pd-standing-where" data-pdr>
                <h3 className="pd-standing-h">The footprint</h3>
                <p className="pd-standing-lead">
                  Born more than 30 years ago as the Phaeton Automotive Group, PAG
                  Direct is the group&apos;s automotive retail arm in Canada.
                </p>
                <ul className="pd-standing-list">
                  <li>
                    <strong>Three dealerships.</strong> Richmond Hill Toyota,
                    Richmond Hill Hyundai and Thornhill Hyundai, all in the Greater
                    Toronto Area.
                  </li>
                  <li>
                    <strong>Great Place to Work Certified.</strong> Recognised for
                    its workplace across every location.
                  </li>
                  <li>
                    <strong>Part of World Automotive Group.</strong> PAG Direct is
                    the group&apos;s retail arm in North America.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* S5 · Closing call to action. Orange stays the action colour. */}
        <section className="relative px-[var(--gutter)] py-24">
          <Scrim />
          <div className="relative max-w-4xl">
            <p data-pdr className="co-kicker">Start here</p>
            <p data-pdr className="pd-close-line">
              Automotive, your way.
            </p>
            <p data-pdr className="pd-close-body">
              New and used Hyundai and Toyota, bought and serviced on your terms,
              in person or entirely online.
            </p>
            <div data-pdr className="pd-cta-row">
              <Link href="/contact" className="pd-btn pd-btn--solid">
                Get in touch
              </Link>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn pd-btn--ghost"
              >
                Visit {company.urlLabel} ↗
              </a>
            </div>
            <p data-pdr className="pd-contact">
              1-888-654-2670. info@pagdirect.com. 11240 Yonge Street, Richmond
              Hill, Ontario.
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
