import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — SewaLink Nepal",
  description: "The legal terms between you and SewaLink Nepal Pvt. Ltd. when booking, paying, or working via our platform.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <InfoPageShell
      title="Terms of service"
      subtitle="Last updated: 2026-08-01 · These terms apply to customers, workers and business accounts on SewaLink."
    >
      <p className="text-xs text-ink-400">
        SewaLink Nepal Pvt. Ltd. (hereafter “SewaLink”, “we”, “our”) operates the
        SewaLink website, mobile applications and related services. By creating
        an account or making a booking, you agree to these terms.
      </p>

      <h2>1. Who we are</h2>
      <p>
        SewaLink is a marketplace platform. We are <em>not</em> an employer of
        the professionals (“pros”, “workers”) who accept jobs via the app. Each
        worker is an independent contractor operating their own business.
        SewaLink provides verification, payment processing, messaging and
        guarantees — nothing more.
      </p>

      <h2>2. Bookings & cancellation</h2>
      <ul>
        <li>Bookings are confirmed when a worker accepts your request.</li>
        <li>Free cancellation up to 1 hour before the agreed slot.</li>
        <li>Inside 1 hour, a cancellation charge (max Rs 200) may apply if the worker has left their home.</li>
        <li>No-shows by the worker result in a full refund, plus a Rs 500 credit towards your next booking.</li>
      </ul>

      <h2>3. Pricing & payments</h2>
      <ul>
        <li>
          The “from Rs X” price is the diagnostic/call-out fee. Any larger amount
          must be agreed with you, in-app, before the worker begins.
        </li>
        <li>Digital payments are processed by eSewa / Khalti / IME Pay / Fonepay. SewaLink never stores your card or wallet PIN.</li>
        <li>Invoices are available in-app on request.</li>
      </ul>

      <h2>4. The 90-day guarantee</h2>
      <p>
        Workmanship is guaranteed for 90 days. If the same fault recurs within
        that window, SewaLink will arrange a re-visit by the original pro or a
        senior pro at no additional charge. The guarantee does not cover new
        faults, accidental damage, or normal wear-and-tear.
      </p>

      <h2>5. Prohibited conduct</h2>
      <ul>
        <li>Attempting to take a job off-platform to avoid fees.</li>
        <li>Sharing or requesting personal contact numbers.</li>
        <li>Discriminatory, abusive, or harassing communications.</li>
      </ul>
      <p>Violations result in immediate account suspension.</p>

      <h2>6. Contact</h2>
      <p>
        Legal queries to{" "}
        <a href="mailto:legal@sewalinknepal.com" className="font-medium">
          legal@sewalinknepal.com
        </a>
        .
      </p>
    </InfoPageShell>
  );
}
