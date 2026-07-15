import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { cn } from "@/lib/cn";

export type Pillar = {
  number: string;
  name: string;
  body: string;
  flagship?: boolean;
  footnote?: string;
};

type PillarGridProps = {
  pillars: readonly Pillar[];
};

/**
 * Numbered 01-04 capability cards. The flagship (01) spans the full row
 * and carries editorial weight; 02-04 sit beneath as a supporting rank.
 */
export function PillarGrid({ pillars }: PillarGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {pillars.map((pillar, i) => (
        <Reveal
          key={pillar.number}
          index={i}
          className={cn(pillar.flagship && "lg:col-span-3")}
        >
          <article
            className={cn(
              "flex h-full flex-col rounded-[var(--radius-card)] border border-hairline p-8 md:p-10",
              pillar.flagship
                ? "gap-10 bg-raised md:flex-row md:items-end md:justify-between"
                : "gap-14 bg-panel",
            )}
          >
            <div className={cn(pillar.flagship && "max-w-2xl")}>
              <MonoLabel tone={pillar.flagship ? "hi" : "faint"}>
                {pillar.number}
                {pillar.flagship && " / FLAGSHIP"}
              </MonoLabel>
              <h3
                className={cn(
                  "mt-6 font-grotesk font-medium uppercase tracking-[var(--track-heading)] text-hi",
                  pillar.flagship ? "text-3xl md:text-4xl" : "text-xl",
                )}
              >
                {pillar.name}
              </h3>
              <p
                className={cn(
                  "mt-4 leading-relaxed",
                  pillar.flagship
                    ? "max-w-xl text-base text-mid"
                    : "text-sm text-low",
                )}
              >
                {pillar.body}
              </p>
            </div>
            {pillar.footnote && (
              <MonoLabel className="shrink-0 text-accent-hover">
                {pillar.footnote}
              </MonoLabel>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
