import { cn } from "@/lib/cn";

type AccentRuleProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/** Hairline accent rule; the left rule on stat tiles, section dividers. */
export function AccentRule({ orientation = "vertical", className }: AccentRuleProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "block bg-accent",
        orientation === "vertical" ? "w-px self-stretch" : "h-px w-10",
        className,
      )}
    />
  );
}
