"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PartyPopper, MessageCircle, MapPinned } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VerifiedStamp } from "@/components/VerifiedStamp";
import { workers } from "@/lib/data";

function ConfirmedContent() {
  const params = useSearchParams();
  const worker = workers.find((w) => w.id === params.get("worker")) ?? workers[0];
  const slot = params.get("slot") ?? slotsFallback();

  function slotsFallback() {
    return "your selected time";
  }

  return (
    <div>
      <Header />
      <section className="container-page flex flex-col items-center py-20 text-center">
        <div className="text-sage-600">
          <VerifiedStamp size={90} label="CONFIRMED" />
        </div>
        <PartyPopper size={22} className="mt-4 text-marigold-500" />
        <h1 className="mt-3 font-display text-2xl font-bold text-ink-900 sm:text-3xl">Booking confirmed!</h1>
        <p className="mt-2 max-w-md text-sm text-ink-700">
          {worker.name} has been notified and will arrive around <strong>{slot}</strong>. You&apos;ll get a live
          tracking link once they&apos;re on the way.
        </p>

        <div className="mt-8 w-full max-w-sm rounded-xl2 border border-ink-900/8 bg-white p-6 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-900 font-display text-sm font-bold text-paper-50">
              {worker.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{worker.name}</p>
              <p className="text-xs text-ink-400">{worker.location}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/12 py-2.5 text-xs font-semibold text-ink-900">
              <MessageCircle size={14} /> Chat
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/12 py-2.5 text-xs font-semibold text-ink-900">
              <MapPinned size={14} /> Track
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/browse" className="rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700">
            Book another service
          </Link>
          <Link href="/" className="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-900">
            Back home
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedContent />
    </Suspense>
  );
}
