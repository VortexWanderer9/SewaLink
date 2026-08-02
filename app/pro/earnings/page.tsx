import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Earnings & payouts — SewaLink Nepal for pros",
  description:
    "How SewaLink pros get paid, our 15% fee structure, weekly Tuesday payouts, bonus programs, and how to see exactly what you earned.",
  alternates: { canonical: "/pro/earnings" },
};

export default function ProEarnings() {
  return (
    <InfoPageShell
      title="Earnings & payouts"
      subtitle="Transparent fees, weekly Tuesday direct deposit, and three bonus programs that add up to 5–15% extra income."
      backHref="/pro/apply"
      backLabel="Apply to join"
    >
      <h2>Fee structure</h2>
      <ul>
        <li><strong>15%</strong> standard platform fee on completed work.</li>
        <li><strong>0%</strong> on tips — 100% goes to you.</li>
        <li><strong>0%</strong> on parts &amp; materials — pass costs through at invoice.</li>
        <li><strong>0%</strong> payment processing fees for cash jobs.</li>
      </ul>
      <p>
        For comparison, a typical Kathmandu electrician works ~18 days a month
        at ~Rs 1,200 average per job and nets around Rs 25,000. Verified
        SewaLink pros average Rs 38,000–Rs 52,000 for the same hours because of
        higher booking volume and bonus programs.
      </p>

      <h2>Bonus programs</h2>
      <ul>
        <li><strong>5-star bonus:</strong> +5% per booking at a perfect 5.0 average (≥10 ratings).</li>
        <li><strong>Fast responder:</strong> +3% if you respond to 95% of new requests within 5 minutes.</li>
        <li><strong>On-time bonus:</strong> +2% if on-time arrival is ≥98% for the month.</li>
      </ul>
      <p>
        Bonuses are added to your weekly payout automatically — nothing to claim,
        nothing to do.
      </p>

      <h2>How payouts work</h2>
      <ol>
        <li>Every booking closes at the end of the day (midnight NPT).</li>
        <li>Tuesday morning — we batch-run payout for all completed jobs up to the previous Sunday.</li>
        <li>Funds arrive in your connected Nepali bank account same-day with most banks.</li>
        <li>A full, itemised statement is available in the pro app under Payouts.</li>
      </ol>

      <h2>Tax compliance</h2>
      <p>
        SewaLink generates a monthly earnings statement for every pro. It is
        your responsibility to declare income and pay any applicable personal
        income tax. We do not deduct tax at source unless you have specifically
        requested TDS deduction in writing.
      </p>
    </InfoPageShell>
  );
}
