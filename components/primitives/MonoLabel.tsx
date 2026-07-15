import { cn } from "@/lib/cn";

type MonoLabelProps = {
  children: React.ReactNode;
  tone?: "default" | "faint" | "hi";
  className?: string;
};

/** Monospace micro-label: "01 / OPERATIONS", "EST. 1994 · ABU DHABI". */
export function MonoLabel({ children, tone = "default", className }: MonoLabelProps) {
  return (
    <span
      className={cn(
        "type-mono block",
        tone === "default" && "text-low",
        tone === "faint" && "text-faint",
        tone === "hi" && "text-hi",
        className,
      )}
    >
      {children}
    </span>
  );
}
