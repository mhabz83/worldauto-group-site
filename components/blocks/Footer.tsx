import { MonoLabel } from "@/components/primitives/MonoLabel";
import { ULink } from "@/components/primitives/ULink";
import { companies, footer, group } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-panel px-[var(--gutter)] py-16">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md">
          <p className="type-kicker text-hi">
            WORLDAUTO<span className="mx-1 text-accent-hover">·</span>
            <span className="font-normal text-low">GROUP</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed text-low">{footer.blurb}</p>
          <MonoLabel tone="faint" className="mt-8">
            {group.hq}
          </MonoLabel>
          <MonoLabel tone="faint">{group.footprint}</MonoLabel>
        </div>

        <nav aria-label="Companies">
          <MonoLabel className="mb-6">{footer.companiesHeading}</MonoLabel>
          <ul className="flex flex-col gap-3">
            {companies.map((c) => (
              <li key={c.slug}>
                <ULink href={c.url} external className="text-sm text-mid">
                  {c.name} <span aria-hidden className="text-faint">↗</span>
                </ULink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Group">
          <MonoLabel className="mb-6">{footer.parentHeading}</MonoLabel>
          <ul className="flex flex-col gap-3">
            <li>
              <ULink href={group.parent.url} external className="text-sm text-mid">
                {footer.parentLine} <span aria-hidden className="text-faint">↗</span>
              </ULink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-hairline pt-8 md:flex-row md:items-center md:justify-between">
        <MonoLabel tone="faint">{footer.legal}</MonoLabel>
        <MonoLabel tone="faint">{group.est}</MonoLabel>
      </div>
    </footer>
  );
}
