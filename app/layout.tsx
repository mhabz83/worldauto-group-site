import type { Metadata } from "next";
import "./globals.css";
import { SkipToContent } from "@/components/primitives/SkipToContent";
import { ScrollFX } from "@/components/site/ScrollFX";

/* Suisse Intl loads via @font-face in the shared brand tokens (app/tokens.css). */

export const metadata: Metadata = {
  title: {
    default: "World Automotive Group",
    template: "%s · World Automotive Group",
  },
  description:
    "World Automotive Group is the automotive arm of Skelmore. Five operating companies across the UAE and North America: FastTrack, AutoData, Axxion, PAG Direct and Vicimus.",
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
