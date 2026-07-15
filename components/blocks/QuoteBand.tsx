import { SerifHeadline } from "@/components/primitives/SerifHeadline";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type QuoteBandProps = {
  lines: readonly string[];
  italicWord?: string;
  attribution?: string;
};

/** A quiet full-width quote moment on the panel surface. */
export function QuoteBand({ lines, italicWord, attribution }: QuoteBandProps) {
  return (
    <blockquote className="border-y border-hairline bg-panel px-[var(--gutter)] py-[var(--space-section-tight)]">
      <SerifHeadline lines={lines} italicWord={italicWord} size="sub" as="p" />
      {attribution && (
        <footer className="mt-8">
          <MonoLabel>{attribution}</MonoLabel>
        </footer>
      )}
    </blockquote>
  );
}
