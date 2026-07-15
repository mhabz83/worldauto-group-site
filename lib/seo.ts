import type { Metadata } from "next";
import { siteMeta } from "@/content/site";

type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
};

/** Per-page metadata helper; OG images land in Phase 2. */
export function buildMetadata({ title, description, path = "/" }: PageSeo): Metadata {
  return {
    // Only set title when given — an explicit `undefined` suppresses the
    // layout's default title entirely instead of falling back to it.
    ...(title !== undefined && { title }),
    description: description ?? siteMeta.description,
    alternates: { canonical: path },
    openGraph: {
      title: title ?? siteMeta.titleDefault,
      description: description ?? siteMeta.description,
      url: path,
      siteName: siteMeta.titleDefault,
      type: "website",
    },
  };
}
