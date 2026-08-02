import type { Metadata } from "next";
import ProApplyView from "@/components/pro/ProApplyView";

export const metadata: Metadata = {
  title: "Apply as a verified professional — SewaLink Nepal",
  description:
    "Join 2,400+ verified electricians, plumbers, cleaners, tutors and other skilled workers earning steady pay through SewaLink. Free to apply.",
  alternates: { canonical: "/pro/apply" },
};

export default function ProApplyPage() {
  return <ProApplyView />;
}
