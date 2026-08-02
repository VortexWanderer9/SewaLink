import { MapPin, Calendar, Wallet, Check } from "lucide-react";
import type { Worker } from "@/lib/data";

export const SLOTS = ["Today, 4:00 PM", "Today, 6:00 PM", "Tomorrow, 9:00 AM", "Tomorrow, 2:00 PM"];
export const PAYMENT_METHODS = [
  { id: "esewa", label: "eSewa" },
  { id: "khalti", label: "Khalti" },
  { id: "imepay", label: "IME Pay" },
  { id: "cash", label: "Cash on completion" },
];

export type BookingState = {
  step: number;
  address: string;
  notes: string;
  slot: string;
  payment: string;
};

export default function BookingStepContent({
  worker,
  state,
  setState,
}: {
  worker: Worker;
  state: BookingState;
  setState: (updater: (prev: BookingState) => BookingState) => void;
}) {
  const firstName = worker.name.split(" ")[0];

  if (state.step === 0) {
    return (
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <MapPin size={18} className="text-indigo-900" aria-hidden="true" /> Where should {firstName} come?
        </h2>
        <label htmlFor="booking-address" className="mt-5 block text-xs font-medium text-ink-700">
          Full address
        </label>
        <input
          id="booking-address"
          value={state.address}
          onChange={(e) => setState((p) => ({ ...p, address: e.target.value }))}
          placeholder="e.g. House 12, Ward 5, Baneshwor, Kathmandu"
          autoComplete="street-address"
          className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
        />
        <label htmlFor="booking-notes" className="mt-4 block text-xs font-medium text-ink-700">
          Describe the issue (optional)
        </label>
        <textarea
          id="booking-notes"
          value={state.notes}
          onChange={(e) => setState((p) => ({ ...p, notes: e.target.value }))}
          rows={3}
          placeholder="e.g. Switchboard sparking in the kitchen, started this morning"
          className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
        />
      </div>
    );
  }

  if (state.step === 1) {
    return (
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Calendar size={18} className="text-indigo-900" aria-hidden="true" /> Choose a time slot
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Available time slots">
          {SLOTS.map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={state.slot === s}
              onClick={() => setState((p) => ({ ...p, slot: s }))}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                state.slot === s
                  ? "border-indigo-900 bg-indigo-900 text-paper-50"
                  : "border-ink-900/12 text-ink-700 hover:border-indigo-900/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (state.step === 2) {
    return (
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Wallet size={18} className="text-indigo-900" aria-hidden="true" /> How will you pay?
        </h2>
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Payment methods">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={state.payment === m.id}
              onClick={() => setState((p) => ({ ...p, payment: m.id }))}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
                state.payment === m.id
                  ? "border-indigo-900 bg-indigo-900/5"
                  : "border-ink-900/12 hover:border-indigo-900/40"
              }`}
            >
              <span>{m.label}</span>
              {state.payment === m.id && <Check size={16} className="text-indigo-900" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink-900">Review your booking</h2>
      <dl className="mt-5 divide-y divide-ink-900/8 text-sm">
        <Row label="Professional" value={worker.name} />
        <Row label="Address" value={state.address || "—"} />
        {state.notes && <Row label="Notes" value={state.notes} />}
        <Row label="Time" value={state.slot} />
        <Row
          label="Payment"
          value={PAYMENT_METHODS.find((m) => m.id === state.payment)?.label ?? ""}
        />
        <Row label="Estimated price" value={`from Rs ${worker.priceFrom}`} />
      </dl>
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
