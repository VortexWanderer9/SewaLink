import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmedView, { ConfirmedMiniLoader } from "@/components/booking/ConfirmedView";

export const metadata: Metadata = {
  title: "Booking confirmed",
  description:
    "Your SewaLink booking has been confirmed. Track your professional's arrival and chat with them in real time.",
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<ConfirmedMiniLoader />}>
      <ConfirmedView />
    </Suspense>
  );
}
