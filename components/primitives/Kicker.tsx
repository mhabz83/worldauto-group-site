import { cn } from "@/lib/cn";

type KickerProps = {
  children: React.ReactNode;
  tone?: "accent" | "dim";
  className?: string;
};

export function Kicker({ children, tone = "accent", className }: KickerProps) {
  return (
    <p
      className={cn(
        "type-kicker",
        tone === "accent" ? "text-accent-hover" : "text-low",
        className,
      )}
    >
      {children}
    </p>
  );
}
