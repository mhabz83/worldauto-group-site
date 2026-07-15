import { MonoLabel } from "@/components/primitives/MonoLabel";
import { AccentRule } from "@/components/primitives/AccentRule";
import type { Company } from "@/content/site";

type CompanyCardProps = {
  company: Company;
  index: number;
};

/**
 * Full company card: wordmark, one-liner, proof stat, outbound CTA.
 * Squared architecture (4px radius) against the rounded chips.
 */
export function CompanyCard({ company, index }: CompanyCardProps) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card relative flex h-full flex-col justify-between gap-14 rounded-[var(--radius-card)] border border-hairline bg-panel p-8 transition-colors duration-[var(--dur-med)] hover:border-accent-hover md:p-10"
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <MonoLabel tone="faint">{String(index + 1).padStart(2, "0")}</MonoLabel>
          <span
            aria-hidden
            className="text-low transition-all duration-[var(--dur-med)] ease-[var(--ease-reveal)] group-hover/card:translate-x-1 group-hover/card:text-accent-hover"
          >
            ↗
          </span>
        </div>
        <h3 className="mt-8 font-grotesk text-2xl font-medium uppercase tracking-[var(--track-heading)] text-hi md:text-3xl">
          {company.name}
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-low">
          {company.oneLiner}
        </p>
      </div>

      <div>
        <div className="flex items-stretch gap-3">
          <AccentRule />
          <MonoLabel tone="hi">{company.proof}</MonoLabel>
        </div>
        <MonoLabel tone="faint" className="mt-6">
          VISIT {company.urlLabel}
        </MonoLabel>
      </div>
    </a>
  );
}
