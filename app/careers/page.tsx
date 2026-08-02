import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at SewaLink Nepal",
  description:
    "Join the team building Nepal's trusted services marketplace. Open roles in engineering, operations, verification, sales and customer support.",
  alternates: { canonical: "/careers" },
};

const ROLES = [
  {
    title: "Senior Backend Engineer — NestJS / PostgreSQL",
    location: "Kathmandu (on-site, with WFH Fridays)",
    type: "Full-time",
    body: "Build the booking, payments and verification APIs that power the entire marketplace. You'll ship daily and own services from PR to prod.",
  },
  {
    title: "Mobile Engineer — React Native",
    location: "Hybrid (Kathmandu Valley)",
    type: "Full-time",
    body: "Bring our worker and customer experiences to native Android and iOS. Integrate eSewa/Khalti SDKs and Socket.IO-based live tracking.",
  },
  {
    title: "Verification Associate",
    location: "Field — Kathmandu, Pokhara, Butwal",
    type: "Full-time",
    body: "Visit wards, meet candidates, cross-check certificates and write the case notes that decide who gets a verified badge. This is the heart of our product.",
  },
  {
    title: "Customer Operations Specialist",
    location: "Kathmandu office (shift work 7am–10pm)",
    type: "Full-time",
    body: "First-line support for customers and pros via phone, chat and WhatsApp. Turn complaints into 5-star recoveries. You'll know every ward, every price point, every pro.",
  },
  {
    title: "Head of Business Sales",
    location: "Kathmandu with travel",
    type: "Full-time + commission",
    body: "Sell SewaLink Business to hotels, offices, co-ops and housing complexes. Build and lead a small B2B sales team as you scale.",
  },
];

export default function Careers() {
  return (
    <InfoPageShell
      title="Careers"
      subtitle="Help us build the most trusted technology company in Nepal. Small team, outsized impact."
    >
      <h2>Why work here</h2>
      <ul>
        <li><strong>Real product, real users, real revenue</strong> — not a demo, not a pilot.</li>
        <li><strong>Competitive Nepali-market pay</strong> with equity for early hires.</li>
        <li><strong>Paid Dashain &amp; Tihar bonus</strong>, 15 days annual leave, and 5 sick days per year.</li>
        <li><strong>Continuous learning budget</strong> for every role — courses, books, conferences.</li>
      </ul>

      <h2>Open roles</h2>
      {ROLES.map((r) => (
        <article
          key={r.title}
          className="my-6 rounded-xl2 border border-ink-900/8 bg-white p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-ink-900">{r.title}</h3>
              <p className="mt-1 text-xs text-ink-400">
                {r.location} · {r.type}
              </p>
            </div>
            <Link
              href="mailto:careers@sewalinknepal.com"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900 px-4 py-2 text-xs font-semibold text-paper-50 transition hover:bg-indigo-700"
            >
              Apply <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-3 text-sm text-ink-700">{r.body}</p>
          <p className="mt-3 text-xs text-ink-400">
            Send your CV and a one-paragraph cover note to{" "}
            <a href="mailto:careers@sewalinknepal.com" className="font-medium text-indigo-900">
              careers@sewalinknepal.com
            </a>
          </p>
        </article>
      ))}

      <h2>Internships</h2>
      <p>
        We hire two interns per year in engineering and operations — typically during
        BBA/BSc summer breaks. Reach out to the email above with your CV and the months
        you&apos;re available. We pay a stipend and provide a real certificate.
      </p>
    </InfoPageShell>
  );
}
