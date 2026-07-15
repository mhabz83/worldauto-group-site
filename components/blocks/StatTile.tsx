"use client";

import { useCountUp } from "@/lib/useCountUp";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { AccentRule } from "@/components/primitives/AccentRule";

export type Stat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  approx?: boolean;
  /** year → no separators; compact → 330K; decimal → 4.6; thousands → 4,000 */
  format?: "year" | "compact" | "decimal" | "thousands";
};

function formatValue(v: number, format?: Stat["format"]): string {
  switch (format) {
    case "year":
      return String(Math.round(v));
    case "compact":
      return v >= 1000 ? `${Math.round(v / 1000)}K` : String(Math.round(v));
    case "decimal":
      return v.toFixed(1);
    case "thousands":
      return Math.round(v).toLocaleString("en-US");
    default:
      return String(Math.round(v));
  }
}

/** Count-up stat: mono label, accent left rule, tabular numerals. */
export function StatTile({ value, label, prefix, suffix, approx, format }: Stat) {
  const { ref, value: current } = useCountUp(value);

  return (
    <div className="flex items-stretch gap-5">
      <AccentRule />
      <div>
        <p className="font-grotesk text-4xl font-medium tracking-tight text-hi tabular-nums md:text-5xl">
          {approx && <span aria-hidden>~</span>}
          {prefix}
          <span ref={ref}>{formatValue(current, format)}</span>
          {suffix}
        </p>
        <MonoLabel className="mt-3">{label}</MonoLabel>
      </div>
    </div>
  );
}
