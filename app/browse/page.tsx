import type { Metadata } from "next";
import { Suspense } from "react";
import BrowseContent, { BrowseMiniLoader } from "@/components/browse/BrowseContent";

export const metadata: Metadata = {
  title: "Browse verified professionals",
  description:
    "Find verified electricians, plumbers, carpenters, AC technicians, tutors, cleaners and more. Filter by category, price or rating. Background-checked and guaranteed.",
  keywords: [
    "electrician Kathmandu",
    "plumber near me",
    "AC repair Pokhara",
    "verified workers Nepal",
    "home services Nepal",
  ],
  alternates: { canonical: "/browse" },
};

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseMiniLoader />}>
      <BrowseContent />
    </Suspense>
  );
}
