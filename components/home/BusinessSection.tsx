import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tiers = [
  ["Basic", "Pay-per-visit, no contract"],
  ["Pro", "Monthly maintenance contracts"],
  ["Enterprise", "Multi-site SLA + priority support"],
  ["Invoicing", "VAT-compliant digital invoices"],
];

export default function BusinessSection() {
  return (
    <section id="business" className="bg-paper-100 py-20" aria-labelledby="biz-heading">
      <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brick-500">For businesses</span>
          <h2 id="biz-heading" className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            One dashboard for every property&apos;s maintenance
          </h2>
          <p className="mt-4 max-w-md text-sm text-ink-700">
            Hotels, offices, and retail chains use SewaLink Business to schedule recurring
            AC servicing, CCTV maintenance, cleaning and pest control across every
            location — with consolidated invoices, not six phone numbers.
          </p>
          <Link
            href="/browse?category=ac-technician"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            Talk to sales <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4" role="list">
          {tiers.map(([title, desc]) => (
            <div key={title} role="listitem" className="rounded-xl2 border border-ink-900/8 bg-white p-4">
              <h3 className="font-display text-sm font-semibold text-ink-900">{title}</h3>
              <p className="mt-1 text-xs text-ink-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
