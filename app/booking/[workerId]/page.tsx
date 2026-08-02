import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingFlow from "@/components/booking/BookingFlow";
import { workers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a verified professional",
  description:
    "Book a SewaLink verified electrician, plumber, or home services pro. Choose a time slot, pay securely, and track arrival live.",
};

export default function BookingPage({ params }: { params: { workerId: string } }) {
  const worker = workers.find((w) => w.id === params.workerId);
  if (!worker) notFound();
  return <BookingFlow worker={worker} workerId={params.workerId} />;
}
