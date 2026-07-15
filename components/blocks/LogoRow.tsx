import { MonoLabel } from "@/components/primitives/MonoLabel";

type LogoRowProps = {
  /** Text wordmarks for now; swap to SVG marks when supplied. */
  names: readonly string[];
  label?: string;
};

/** Greyscale wordmark row; brightness lifts on hover. */
export function LogoRow({ names, label }: LogoRowProps) {
  return (
    <div>
      {label && <MonoLabel className="mb-8">{label}</MonoLabel>}
      <ul className="flex flex-wrap items-center gap-x-14 gap-y-8">
        {names.map((name) => (
          <li
            key={name}
            className="font-grotesk text-lg font-medium uppercase tracking-[var(--track-heading)] text-faint transition-colors duration-[var(--dur-med)] hover:text-hi"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
