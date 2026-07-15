import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  /** dark = base canvas; panel = slightly lifted; bleed = full-bleed media section (no gutter). */
  variant?: "dark" | "panel" | "bleed";
  /** Tighter vertical rhythm for stacked sections. */
  tight?: boolean;
  id?: string;
  className?: string;
};

export function Section({
  children,
  variant = "dark",
  tight = false,
  id,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        variant === "dark" && "bg-base",
        variant === "panel" && "border-y border-hairline bg-panel",
        variant !== "bleed" && "px-[var(--gutter)]",
        tight
          ? "py-[var(--space-section-tight)]"
          : "py-[var(--space-section)]",
        variant === "bleed" && "p-0",
        className,
      )}
    >
      {children}
    </section>
  );
}
