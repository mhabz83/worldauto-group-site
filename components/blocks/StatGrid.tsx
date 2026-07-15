import { Reveal } from "@/components/primitives/Reveal";
import { StatTile, type Stat } from "@/components/blocks/StatTile";
import { cn } from "@/lib/cn";

type StatGridProps = {
  stats: readonly Stat[];
  columns?: 2 | 4;
  className?: string;
};

export function StatGrid({ stats, columns = 4, className }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-x-10 gap-y-12 sm:grid-cols-2",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <Reveal key={stat.label} index={i}>
          <StatTile {...stat} />
        </Reveal>
      ))}
    </div>
  );
}
