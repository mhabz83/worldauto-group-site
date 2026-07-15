import Image from "next/image";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { cn } from "@/lib/cn";

type MediaPlateProps = {
  src: string;
  alt: string;
  caption?: string;
  /** Column-following scrim so overlaid text stays legible. */
  scrim?: boolean;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Full-bleed image plate, edge-to-edge (object-fit cover, never letterboxed),
 * with an optional mono caption pinned to the bottom edge.
 */
export function MediaPlate({
  src,
  alt,
  caption,
  scrim = true,
  children,
  className,
}: MediaPlateProps) {
  return (
    <figure className={cn("relative isolate w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      {scrim && (
        <div aria-hidden className="absolute inset-0 bg-[image:var(--scrim-plate)]" />
      )}
      {children && <div className="relative z-10 h-full">{children}</div>}
      {caption && (
        <figcaption className="absolute bottom-5 end-[var(--gutter)] z-10">
          <MonoLabel tone="faint">{caption}</MonoLabel>
        </figcaption>
      )}
    </figure>
  );
}
