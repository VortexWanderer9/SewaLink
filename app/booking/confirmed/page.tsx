import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmedView, { ConfirmedMiniLoader } from "@/components/booking/ConfirmedView";
import { getWorkerById } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Booking confirmed",
  description:
    "Your SewaLink booking has been confirmed. Track your professional's arrival and chat with them in real time.",
  robots: { index: false, follow: false },
};

async function ConfirmedPageContent({ workerId }: { workerId?: string }) {
  let worker = null;
  
  if (workerId) {
    worker = await getWorkerById(workerId);
  }
  
  if (!worker) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-sm text-ink-400">Worker not found. Please try booking again.</p>
      </div>
    );
  }
  
  return <ConfirmedView worker={worker} />;
}

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: { worker?: string };
}) {
  return (
    <Suspense fallback={<ConfirmedMiniLoader />}>
      <ConfirmedPageContent workerId={searchParams.worker} />
    </Suspense>
  );
}
