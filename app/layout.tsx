import type { Metadata } from "next";
import "./globals.css";
import { SkipToContent } from "@/components/primitives/SkipToContent";
import { ScrollFX } from "@/components/site/ScrollFX";

/* Suisse Intl loads via @font-face in the shared brand tokens (app/tokens.css). */

export const metadata: Metadata = {
  metadataBase: new URL("https://worldauto.group"),
  title: {
    default: "World Automotive Group",
    template: "%s · World Automotive Group",
  },
  description:
    "World Automotive Group is the automotive arm of Skelmore. Five operating companies across MENA and North America: FastTrack, AutoData, Axxion, PAG Direct and Vicimus.",
  openGraph: {
    title: "World Automotive Group",
    description:
      "We build and run automotive. MENA and North America, since 1994.",
    url: "https://worldauto.group",
    siteName: "World Automotive Group",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "World Automotive Group" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Automotive Group",
    description:
      "We build and run automotive. MENA and North America, since 1994.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-base">
        {/* mark the doc before paint so [data-reveal] can hide without a flash;
            no-JS visitors never get the class, so they always see content */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('gsap')",
          }}
        />
        <SkipToContent />
        <ScrollFX />
        {children}
      </body>
    </html>
  );
}
