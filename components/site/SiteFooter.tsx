import Link from "next/link";
import { companies, footer, group } from "@/content/site";

/* Shared footer for inner pages. Company list + group line + legal. */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-hairline px-[var(--gutter)] py-16">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-lg uppercase tracking-[0.28em] text-hi">
            <span className="font-medium">WorldAuto</span>{" "}
            <span className="text-mid">Group</span>
          </p>
          <p className="mt-5 text-mid">{footer.blurb}</p>
        </div>

        <div>
          <p className="type-kicker text-faint">{footer.companiesHeading}</p>
          <ul className="mt-5 space-y-2">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/companies/${c.slug}`}
                  className="link-sweep text-mid hover:text-hi"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-kicker text-faint">{footer.parentHeading}</p>
          <ul className="mt-5 space-y-2 text-mid">
            <li>{footer.parentLine}</li>
            <li>{group.footprint}</li>
            <li>
              <Link href="/contact" className="link-sweep text-mid hover:text-hi">
                Contact the group office
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-16 type-kicker text-faint">{footer.legal}</p>
    </footer>
  );
}
