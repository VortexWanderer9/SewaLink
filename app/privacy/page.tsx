import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — SewaLink Nepal",
  description:
    "What data SewaLink Nepal collects, why we need it, how long we keep it, and how to request deletion. Fully compliant with the Nepal Data Protection Act 2075.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <InfoPageShell
      title="Privacy policy"
      subtitle="Last updated: 2026-08-01 · We follow the Nepal Data Protection Act, 2075 — not a generic Californian template."
    >
      <h2>TL;DR</h2>
      <ul>
        <li>We collect only what we need to run a service marketplace.</li>
        <li>Your phone number and address are <em>never</em> shared with workers.</li>
        <li>Verification documents are encrypted at rest and deleted 90 days after a worker is rejected.</li>
        <li>You can delete your account and all personal data, in-app, in one click.</li>
      </ul>

      <h2>What we collect — Customers</h2>
      <ul>
        <li><strong>Account:</strong> Phone number, full name, email (optional).</li>
        <li><strong>Bookings:</strong> Service addresses, job notes, payment records.</li>
        <li><strong>Usage:</strong> App version, device type, crash logs — standard telemetry.</li>
      </ul>

      <h2>What we collect — Workers</h2>
      <ul>
        <li><strong>Account:</strong> Phone number, full name, bank account (for payouts).</li>
        <li><strong>Verification:</strong> Citizenship scan, ward letter, trade certificates, selfie, GPS coordinates of in-person spot checks.</li>
        <li><strong>Performance:</strong> Ratings, reviews, on-time rate, completion rate, earnings.</li>
      </ul>

      <h2>Who data is shared with</h2>
      <ul>
        <li><strong>Payment partners</strong> (eSewa, Khalti, IME Pay): minimum data required to process or refund a transaction.</li>
        <li><strong>Emergency:</strong> Local authorities only, with a valid court order or genuine immediate life-safety reason.</li>
        <li><strong>Never:</strong> advertisers, data brokers, marketing lists.</li>
      </ul>

      <h2>Your rights (Data Protection Act, 2075)</h2>
      <ul>
        <li><strong>Access:</strong> Get a complete copy of your data — Settings → Export my data.</li>
        <li><strong>Correct:</strong> Edit your profile at any time.</li>
        <li><strong>Delete:</strong> Settings → Delete my account. Most records are purged within 30 days, except those legally required for tax or dispute records (max 5 years).</li>
        <li><strong>Object:</strong> Email{" "}
          <a href="mailto:privacy@sewalinknepal.com" className="font-medium">privacy@sewalinknepal.com</a> — we respond within 7 working days.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use a small number of strictly-necessary cookies (login, anti-fraud)
        plus optional analytics cookies you can decline on your first visit. No
        third-party advertising cookies — ever.
      </p>
    </InfoPageShell>
  );
}
