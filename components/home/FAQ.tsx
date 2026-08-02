import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is it safe to let a stranger into my home?",
    a: "Every professional on SewaLink passes ID verification, a background check, and skill certification before they can accept jobs. You can see their verification badge, ratings, and past job count before booking.",
  },
  {
    q: "What payment methods are supported?",
    a: "eSewa, Khalti, IME Pay, Fonepay, major cards, and cash on completion — you choose at checkout.",
  },
  {
    q: "How are workers verified?",
    a: "We check citizenship/ID documents, request a ward recommendation letter, and review trade certificates. Gulf and Malaysia-trained tradespeople can fast-track using their foreign employment records.",
  },
  {
    q: "What if I'm not satisfied with the service?",
    a: "Every booking includes a 90-day workmanship guarantee. Flag an issue in-app and our support team will arrange a free follow-up visit or refund.",
  },
];

export default function FAQ() {
  return (
    <section className="container-page py-20" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        Frequently asked
      </h2>
      <div className="mt-8 divide-y divide-ink-900/8 rounded-xl2 border border-ink-900/8 bg-white">
        {faqs.map((f, i) => (
          <details key={f.q} className="group p-5">
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-ink-900"
              aria-controls={`faq-panel-${i}`}
            >
              {f.q}
              <ChevronDown size={16} className="shrink-0 text-ink-400 transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p id={`faq-panel-${i}`} className="mt-3 text-sm leading-relaxed text-ink-700">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
