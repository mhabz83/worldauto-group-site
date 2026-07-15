import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";

export type Milestone = {
  year: string;
  title: string;
  detail: string;
};

type TimelineRowProps = {
  rows: readonly Milestone[];
};

/** Heritage rows: mono year rail, hairline dividers, serif-free and quiet. */
export function TimelineRow({ rows }: TimelineRowProps) {
  return (
    <ol className="border-t border-hairline">
      {rows.map((row, i) => (
        <li key={row.year + row.title}>
          <Reveal
            index={i}
            className="grid gap-2 border-b border-hairline py-8 md:grid-cols-[8rem_1fr_1.2fr] md:gap-10 md:py-10"
          >
            <MonoLabel tone="hi" className="pt-1 text-accent-hover">
              {row.year}
            </MonoLabel>
            <h3 className="font-grotesk text-lg font-medium uppercase tracking-[var(--track-heading)] text-hi">
              {row.title}
            </h3>
            <p className="text-sm leading-relaxed text-low">{row.detail}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
