import { Check } from "lucide-react";

export const STEPS = ["Address", "Time slot", "Payment", "Review"];

export default function BookingStepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2" role="list" aria-label="Booking progress">
      {STEPS.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-2" role="listitem" aria-current={i === step ? "step" : undefined}>
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              i < step
                ? "bg-sage-500 text-white"
                : i === step
                  ? "bg-indigo-900 text-paper-50"
                  : "bg-paper-200 text-ink-400"
            }`}
            aria-hidden={i !== step ? true : undefined}
          >
            {i < step ? <Check size={13} aria-hidden="true" /> : i + 1}
          </div>
          <span className={`hidden text-xs font-medium sm:inline ${i === step ? "text-ink-900" : "text-ink-400"}`}>
            {s}
          </span>
          {i < STEPS.length - 1 && <div className="h-px flex-1 bg-paper-200" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
