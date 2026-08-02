import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Help Center — SewaLink Nepal",
  description:
    "Answers to common questions about booking, payments, cancellation, guarantees, and how our worker verification works.",
  alternates: { canonical: "/help" },
};

const CATEGORIES = [
  {
    title: "Booking & scheduling",
    items: [
      {
        q: "How far in advance can I book?",
        a: "Up to 30 days. Same-day bookings are available for most categories if a pro is free.",
      },
      {
        q: "Can I reschedule or cancel?",
        a: "Yes, free up to 1 hour before the slot. After that a small cancellation fee may apply if the pro has already started travelling.",
      },
      {
        q: "What if the pro is late or doesn't show?",
        a: "You can message them in-app. If they're more than 30 minutes late, contact support and we'll reassign the job to another pro or issue a full refund.",
      },
    ],
  },
  {
    title: "Pricing & payments",
    items: [
      {
        q: "Is the 'from Rs X' price final?",
        a: "It's the diagnostic / call-out fee. The pro will confirm the total with you after seeing the job, and nothing is charged until you agree.",
      },
      {
        q: "Which wallets and cards are supported?",
        a: "eSewa, Khalti, IME Pay, Fonepay, Visa/Mastercard (via eSewa Khalti gateways), and cash on completion.",
      },
    ],
  },
  {
    title: "Safety & guarantees",
    items: [
      {
        q: "What happens if something breaks after the job?",
        a: "Every booking carries a 90-day workmanship guarantee. Open a dispute in-app and we'll send the same pro back, free, or assign a senior pro if the issue persists.",
      },
      {
        q: "How are workers really checked?",
        a: "Citizenship scan + ward letter + trade certificate + 2 personal references, plus a random in-person spot check by our verification team. See our full verification flow at /pro/verification.",
      },
    ],
  },
];

export default function Help() {
  return (
    <InfoPageShell
      title="Help center"
      subtitle="Everything you need to know about booking, paying and guaranteeing a SewaLink job."
      backLabel="Home"
    >
      {CATEGORIES.map((cat) => (
        <div key={cat.title} className="mb-8">
          <h2>{cat.title}</h2>
          <div className="mt-4 divide-y divide-ink-900/8 rounded-xl2 border border-ink-900/8 bg-white">
            {cat.items.map((it) => (
              <details key={it.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-ink-900">
                  {it.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{it.a}</p>
              </details>
            ))}
          </div>
        </div>
      ))}

      <h2>Still stuck?</h2>
      <p>
        Our support team is available 7am–10pm NPT, 7 days a week. Call{" "}
        <a href="tel:+97715555555" className="font-medium text-indigo-900">
          +977-1-5555555
        </a>
        , email{" "}
        <a href="mailto:support@sewalinknepal.com" className="font-medium text-indigo-900">
          support@sewalinknepal.com
        </a>
        , or use the in-app chat for the fastest reply.
      </p>
    </InfoPageShell>
  );
}
