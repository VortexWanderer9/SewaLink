import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingFlow from "@/components/booking/BookingFlow";
import { getWorkerById } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a verified professional",
  description:
    "Book a SewaLink verified electrician, plumber, or home services pro. Choose a time slot, pay securely, and track arrival live.",
};

export default async function BookingPage({ params }: { params: { workerId: string } }) {
  const worker = await getWorkerById(params.workerId);
  if (!worker) notFound();
  return <BookingFlow worker={worker} workerId={params.workerId} />;
}
