"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Check, MapPin, Calendar, Wallet, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { workers } from "@/lib/data";

const steps = ["Address", "Time slot", "Payment", "Review"];
const slots = ["Today, 4:00 PM", "Today, 6:00 PM", "Tomorrow, 9:00 AM", "Tomorrow, 2:00 PM"];
const paymentMethods = [
  { id: "esewa", label: "eSewa" },
  { id: "khalti", label: "Khalti" },
  { id: "imepay", label: "IME Pay" },
  { id: "cash", label: "Cash on completion" },
];

export default function BookingPage({ params }: { params: { workerId: string } }) {
  const worker = workers.find((w) => w.id === params.workerId);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [slot, setSlot] = useState(slots[0]);
  const [payment, setPayment] = useState(paymentMethods[0].id);

  if (!worker) notFound();

  const canProceed = step === 0 ? address.trim().length > 3 : true;

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else router.push(`/booking/confirmed?worker=${worker!.id}&slot=${encodeURIComponent(slot)}`);
  }

  return (
    <div>
      <Header />
      <section className="border-b border-ink-900/8 bg-paper-100 py-8">
        <div className="container-page">
          <h1 className="font-display text-xl font-bold text-ink-900">Book {worker.name}</h1>
          <div className="mt-5 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    i < step ? "bg-sage-500 text-white" : i === step ? "bg-indigo-900 text-paper-50" : "bg-paper-200 text-ink-400"
                  }`}
                >
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <span className={`hidden text-xs font-medium sm:inline ${i === step ? "text-ink-900" : "text-ink-400"}`}>{s}</span>
                {i < steps.length - 1 && <div className="h-px flex-1 bg-paper-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr,300px]">
        <div className="rounded-xl2 border border-ink-900/8 bg-white p-6 sm:p-8">
          {step === 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                <MapPin size={18} className="text-indigo-900" /> Where should {worker.name.split(" ")[0]} come?
              </h2>
              <label className="mt-5 block text-xs font-medium text-ink-700">Full address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House 12, Ward 5, Baneshwor, Kathmandu"
                className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
              />
              <label className="mt-4 block text-xs font-medium text-ink-700">Describe the issue (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Switchboard sparking in the kitchen, started this morning"
                className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                <Calendar size={18} className="text-indigo-900" /> Choose a time slot
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      slot === s ? "border-indigo-900 bg-indigo-900 text-paper-50" : "border-ink-900/12 text-ink-700 hover:border-indigo-900/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                <Wallet size={18} className="text-indigo-900" /> How will you pay?
              </h2>
              <div className="mt-5 space-y-2.5">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
                      payment === m.id ? "border-indigo-900 bg-indigo-900/5" : "border-ink-900/12 hover:border-indigo-900/40"
                    }`}
                  >
                    {m.label}
                    {payment === m.id && <Check size={16} className="text-indigo-900" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">Review your booking</h2>
              <dl className="mt-5 divide-y divide-ink-900/8 text-sm">
                <Row label="Professional" value={worker.name} />
                <Row label="Address" value={address || "—"} />
                {notes && <Row label="Notes" value={notes} />}
                <Row label="Time" value={slot} />
                <Row label="Payment" value={paymentMethods.find((m) => m.id === payment)?.label ?? ""} />
                <Row label="Estimated price" value={`from Rs ${worker.priceFrom}`} />
              </dl>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-ink-900/8 pt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`flex items-center gap-1.5 text-sm font-medium text-ink-700 ${step === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === steps.length - 1 ? "Confirm booking" : "Continue"} <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-xl2 border border-ink-900/8 bg-paper-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900 font-display text-xs font-bold text-paper-50">
              {worker.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{worker.name}</p>
              <p className="text-xs text-ink-400">{worker.location}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-ink-700">
            <p>90-day workmanship guarantee included</p>
            <p>Free cancellation up to 1 hour before arrival</p>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{value}</dd>
    </div>
  );
}
