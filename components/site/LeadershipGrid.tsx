import { leaders } from "@/content/site";

/* Initials monogram so the section looks complete without needing photos.
   Swap in real portraits later if the group wants them. */
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase() || "—";
}

export function LeadershipGrid() {
  return (
    <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {leaders.map((l, i) => (
        <div data-reveal key={i} className="border-t border-hairline pt-8">
          <div
            aria-hidden
            className="flex h-14 w-14 items-center justify-center rounded-full border border-hairline-strong bg-[rgba(2,4,15,0.4)] type-kicker text-hi"
          >
            {initials(l.name)}
          </div>
          <h3 className="mt-6 text-lg font-medium text-hi">{l.name}</h3>
          <p className="mt-1 type-kicker text-highlight">{l.title}</p>
          {l.bio && <p className="mt-4 text-mid">{l.bio}</p>}
        </div>
      ))}
    </div>
  );
}
