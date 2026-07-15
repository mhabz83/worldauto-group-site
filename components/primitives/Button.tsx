import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "text";
  external?: boolean;
  className?: string;
};

const base =
  "type-kicker inline-flex items-center gap-3 rounded-full transition-colors duration-[var(--dur-fast)] group/button";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  solid:
    "bg-accent text-hi px-7 py-4 hover:bg-accent-hover glow-accent",
  ghost:
    "border border-hairline-strong text-hi px-7 py-4 hover:border-accent-hover hover:text-accent-hover",
  text: "text-hi px-0 py-2 hover:text-accent-hover",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-[var(--dur-med)] ease-[var(--ease-reveal)] group-hover/button:translate-x-1"
    >
      →
    </span>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  external = false,
  className,
}: ButtonProps) {
  const cls = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span>{children}</span>
        <Arrow />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
