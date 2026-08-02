import Link from "next/link";
import { BarChart3, Users } from "lucide-react";

export default function InvestorSection() {
  return (
    <section className="container-page py-20" aria-labelledby="inv-heading">
      <div className="rounded-[2rem] border border-ink-900/8 bg-white p-10 sm:p-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brick-500">For investors</span>
            <h2 id="inv-heading" className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              Building the trust layer for Nepal&apos;s services economy
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink-700">
              SewaLink is assembling the verification, dispatch, and payments
              infrastructure a market this size has never had. Get our deck and
              latest traction numbers.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm" role="list">
              <Stat icon={Users} label="Verified pros" value="2,400+" />
              <Stat icon={BarChart3} label="Jobs completed" value="38,000+" />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href="/browse"
              className="rounded-full bg-indigo-900 px-6 py-3 text-center text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
            >
              Download pitch deck
            </Link>
            <Link
              href="/browse"
              className="rounded-full border border-ink-900/15 px-6 py-3 text-center text-sm font-semibold text-ink-900 transition hover:border-indigo-900/40"
            >
              Contact founders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div role="listitem" className="rounded-xl2 border border-ink-900/8 bg-paper-50 p-4">
      <Icon size={16} className="text-marigold-600" aria-hidden="true" />
      <p className="mt-2 font-display text-lg font-bold text-ink-900">{value}</p>
      <p className="text-[11px] text-ink-400">{label}</p>
    </div>
  );
}
