"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingStepper, { STEPS } from "@/components/booking/BookingStepper";
import BookingStepContent, {
  SLOTS,
  type BookingState,
} from "@/components/booking/BookingStepContent";
import BookingSidebar from "@/components/booking/BookingSidebar";
import type { Worker } from "@/lib/data";

export default function BookingFlow({ worker, workerId }: { worker: Worker; workerId: string }) {
  const router = useRouter();
  const [state, setState] = useState<BookingState>({
    step: 0,
    address: "",
    notes: "",
    slot: SLOTS[0],
    payment: "esewa",
  });

  const updateState = useCallback(
    (updater: (prev: BookingState) => BookingState) => setState(updater),
    []
  );

  const canProceed = useMemo(
    () => (state.step === 0 ? state.address.trim().length > 3 : true),
    [state.step, state.address]
  );

  const next = useCallback(() => {
    if (state.step < STEPS.length - 1) {
      setState((p) => ({ ...p, step: p.step + 1 }));
    } else {
      router.push(
        `/booking/confirmed?worker=${encodeURIComponent(workerId)}&slot=${encodeURIComponent(state.slot)}`
      );
    }
  }, [state.step, state.slot, router, workerId]);

  return (
    <div>
      <Header />
      <section className="border-b border-ink-900/8 bg-paper-100 py-8">
        <div className="container-page">
          <h1 className="font-display text-xl font-bold text-ink-900">Book {worker.name}</h1>
          <div className="mt-5">
            <BookingStepper step={state.step} />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr,300px]">
        <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 sm:p-8">
          <BookingStepContent worker={worker} state={state} setState={updateState} />
          <div className="mt-8 flex items-center justify-between border-t border-ink-900/8 pt-6">
            <button
              onClick={() => setState((p) => ({ ...p, step: Math.max(0, p.step - 1) }))}
              className={`flex items-center gap-1.5 text-sm font-medium text-ink-700 ${state.step === 0 ? "invisible" : ""}`}
              disabled={state.step === 0}
              aria-disabled={state.step === 0}
            >
              <ArrowLeft size={15} aria-hidden="true" /> Back
            </button>
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {state.step === STEPS.length - 1 ? "Confirm booking" : "Continue"} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
        <BookingSidebar worker={worker} />
      </section>
      <Footer />
    </div>
  );
}
