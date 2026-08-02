"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PartyPopper, MessageCircle, MapPinned, CalendarDays, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VerifiedStamp } from "@/components/VerifiedStamp";
import { workers } from "@/lib/data";

export function ConfirmedMiniLoader() {
  return (
    <div>
      <Header />
      <div className="container-page py-24 flex flex-col items-center gap-5">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-indigo-900/20 border-t-indigo-900" />
        <p className="font-mono text-xs text-ink-400">Confirming your booking…</p>
      </div>
      <Footer />
    </div>
  );
}

export default function ConfirmedView() {
  const params = useSearchParams();
  const worker = workers.find((w) => w.id === params.get("worker")) ?? workers[0];
  const slot = params.get("slot") ?? "your selected time";

  return (
    <div>
      <Header />
      <section className="container-page flex flex-col items-center py-20 text-center">
        <div className="text-sage-600">
          <VerifiedStamp size={90} label="CONFIRMED" />
        </div>
        <PartyPopper size={22} className="mt-4 text-marigold-500" aria-hidden="true" />
        <h1 className="mt-3 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          Booking confirmed!
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-700">
          {worker.name} has been notified and will arrive around <strong>{slot}</strong>. You&apos;ll get a live
          tracking link once they&apos;re on the way.
        </p>

        <div className="mt-8 w-full max-w-sm rounded-xl2 border border-ink-900/8 bg-white p-6 text-left">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-900 font-display text-sm font-bold text-paper-50"
              aria-hidden="true"
            >
              {worker.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{worker.name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-ink-400">
                <MapPinned size={11} aria-hidden="true" /> {worker.location}
              </p>
            </div>
            <ShieldCheck size={16} className="text-sage-600 shrink-0" aria-label="Verified" />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-paper-50 px-3 py-2 text-xs text-ink-700">
            <CalendarDays size={13} className="text-indigo-900 shrink-0" aria-hidden="true" />
            <span className="truncate">{slot}</span>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/12 py-2.5 text-xs font-semibold text-ink-900 transition hover:border-indigo-900/40"
              aria-label={`Chat with ${worker.name}`}
            >
              <MessageCircle size={14} aria-hidden="true" /> Chat
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/12 py-2.5 text-xs font-semibold text-ink-900 transition hover:border-indigo-900/40"
              aria-label="Track your professional"
            >
              <MapPinned size={14} aria-hidden="true" /> Track
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/browse"
            className="rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            Book another service
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-900"
          >
            Back home
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
