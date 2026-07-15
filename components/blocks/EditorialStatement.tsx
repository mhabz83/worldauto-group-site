import { SerifHeadline } from "@/components/primitives/SerifHeadline";
import { cn } from "@/lib/cn";

type EditorialStatementProps = {
  lines: readonly string[];
  italicWord?: string;
  /** Pull the statement across a neighboring photo plate's edge. */
  overlap?: "none" | "up";
  indents?: readonly number[];
  className?: string;
};

/**
 * The once-per-page oversized serif moment. With overlap="up" the headline
 * rides over the top edge of the plate that follows it.
 */
export function EditorialStatement({
  lines,
  italicWord,
  overlap = "none",
  indents,
  className,
}: EditorialStatementProps) {
  return (
    <div
      className={cn(
        "relative z-10",
        overlap === "up" && "-mb-[0.65em] text-[length:var(--type-editorial)]",
        className,
      )}
    >
      <SerifHeadline lines={lines} italicWord={italicWord} indents={indents} />
    </div>
  );
}
