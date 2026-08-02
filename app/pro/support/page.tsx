import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Pro support — SewaLink Nepal",
  description:
    "Dedicated support for SewaLink pros. Application status, payouts, booking disputes, tool replacement claims and priority phone lines.",
  alternates: { canonical: "/pro/support" },
};

export default function ProSupport() {
  return (
    <InfoPageShell
      title="Pro support"
      subtitle="Every active pro gets a priority phone line and a dedicated WhatsApp support contact."
      backHref="/pro/apply"
      backLabel="Back to apply"
    >
      <h2>Contact methods (for active pros only)</h2>
      <ul>
        <li><strong>Priority pro helpline:</strong> <a href="tel:+9779801111111" className="font-medium">+977-98-0111-1111</a> (7am–10pm, 7 days)</li>
        <li><strong>Pro WhatsApp:</strong> +977-98-0111-1112 — fasted response, with photos, location etc.</li>
        <li><strong>Dispute email:</strong> <a href="mailto:pro-disputes@sewalinknepal.com" className="font-medium">pro-disputes@sewalinknepal.com</a> — for booking issues, 24-hour SLA.</li>
        <li><strong>Application status email:</strong> <a href="mailto:onboarding@sewalinknepal.com" className="font-medium">onboarding@sewalinknepal.com</a></li>
      </ul>

      <h2>Wait — I&apos;m a customer, not a pro</h2>
      <p>
        Use the customer help centre at <a href="/help" className="font-medium text-indigo-900">/help</a> instead.
      </p>

      <h2>Pro support — what we can do for you</h2>
      <ul>
        <li>Reassign or cancel bookings when an emergency means you can&apos;t make a slot.</li>
        <li>Escalate non-paying customers to our mediation team.</li>
        <li>Replace broken tools (up to Rs 5,000 per year) if damaged during a SewaLink booking.</li>
        <li>Extend short-term interest-free loans (up to Rs 15,000) for pros with 100+ completed jobs.</li>
      </ul>

      <h2>Working hours</h2>
      <p>
        Pro support runs from 7am to 10pm, 7 days a week. We have skeleton
        cover from 10pm to 7am for genuine safety emergencies only.
      </p>
    </InfoPageShell>
  );
}
