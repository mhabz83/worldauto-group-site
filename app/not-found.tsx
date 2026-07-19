import Link from "next/link";
import { nav } from "@/content/site";
import { MonoLabel } from "@/components/primitives/MonoLabel";

/* Branded 404: navy field, the wordmark, one plain line, one way home. */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center bg-base px-[var(--gutter)]">
      <span className="wag-wordmark mb-10" aria-label="WORLDAUTO GROUP">
        <strong>
          WORLD<span>AUTO</span>
        </strong>
        <span>{nav.wordmark.thin}</span>
      </span>
      <MonoLabel tone="faint" className="mb-8">
        404 · PAGE NOT FOUND
      </MonoLabel>
      <h1 className="type-editorial max-w-[16ch]">
        This road doesn&apos;t <em className="serif-italic">exist.</em>
      </h1>
      <Link
        href="/"
        className="type-kicker link-sweep mt-12 text-accent-hover"
      >
        Back to the homepage →
      </Link>
    </main>
  );
}
