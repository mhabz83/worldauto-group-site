import Link from "next/link";
import { cn } from "@/lib/cn";

type ULinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
};

/** Inline link with underline sweep. */
export function ULink({ href, children, external = false, className }: ULinkProps) {
  const cls = cn("link-sweep text-hi", className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
