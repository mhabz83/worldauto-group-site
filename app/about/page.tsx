import type { Metadata } from "next";
import { AboutExperience } from "@/components/about/AboutExperience";
import "./about.css";

export const metadata: Metadata = {
  title: "The Group",
  description:
    "World Automotive Group is the automotive arm of Skelmore, founded 1994 in Abu Dhabi. We build and run automotive operations across the UAE and North America, then productize what works.",
};

export default function AboutPage() {
  return <AboutExperience />;
}
