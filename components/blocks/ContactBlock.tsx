import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Kicker } from "@/components/primitives/Kicker";
import { group } from "@/content/site";

type ContactBlockProps = {
  heading?: string;
  email?: string;
};

/**
 * HQ + direct contact block. Email stays empty until confirmed
 * ([TO CONFIRM: public contact email] — PLACEHOLDERS.md).
 */
export function ContactBlock({ heading = "The group office", email }: ContactBlockProps) {
  return (
    <div className="rounded-[var(--radius-card)] border border-hairline bg-panel p-8 md:p-10">
      <Kicker tone="dim">{heading}</Kicker>
      <p className="mt-6 max-w-sm font-grotesk text-xl font-medium text-hi">
        {group.name}
      </p>
      <MonoLabel className="mt-4">{group.hq}</MonoLabel>
      <MonoLabel tone="faint">{group.footprint}</MonoLabel>
      {email && (
        <a href={`mailto:${email}`} className="link-sweep type-kicker mt-8 inline-block text-accent-hover">
          {email}
        </a>
      )}
    </div>
  );
}
