import Link from "next/link";
import { MonoLabel } from "@/components/primitives/MonoLabel";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center bg-base px-[var(--gutter)]">
      <MonoLabel tone="faint" className="mb-8">
        404 · WORLD AUTOMOTIVE GROUP
      </MonoLabel>
      <h1 className="type-editorial max-w-[16ch]">
        this road doesn&apos;t <em className="serif-italic">exist.</em>
      </h1>
      <Link
        href="/"
        className="type-kicker link-sweep mt-12 text-accent-hover"
      >
        Back to the group →
      </Link>
    </main>
  );
}
