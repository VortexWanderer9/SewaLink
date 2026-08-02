import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "About SewaLink Nepal",
  description:
    "SewaLink Nepal is building the trust layer for Nepal's services economy — verified workers, transparent pricing, and secure payments for every home and business job.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <InfoPageShell
      title="About SewaLink Nepal"
      subtitle="Building the trust, dispatch and payments infrastructure Nepal's services market has never had."
    >
      <h2>Our mission</h2>
      <p>
        In Nepal, finding a reliable plumber or electrician usually means ringing three
        neighbours, crossing your fingers, and hoping whoever shows up is honest,
        skilled, and charges a fair price. For skilled workers, most jobs come through
        word-of-mouth networks that can&apos;t be scaled, leaving even the best tradespeople
        underemployed.
      </p>
      <p>
        <strong>SewaLink</strong> exists to fix that. We run every professional through a
        rigorous four-step verification process, then match them to customers across
        Kathmandu Valley, Pokhara and — soon — every major city in the country.
      </p>

      <h2>How we&apos;re different</h2>
      <h3>1. Verification is the product</h3>
      <p>
        The verified ink stamp on every worker profile isn&apos;t decoration. We check
        citizenship/ID, trade certificates, a ward-level recommendation letter, and
        personal references before onboarding. Gulf and Malaysia-trained tradespeople
        qualify for a fast-track pathway using their foreign employment records.
      </p>
      <h3>2. Pricing transparency</h3>
      <p>
        Every worker has a visible starting price. If the job is bigger than expected,
        they confirm a revised total with you in-app before starting — no mid-job
        surprise bills.
      </p>
      <h3>3. A real Nepali team, not a foreign app</h3>
      <p>
        Our team is based in Kathmandu. We understand the ward system, the price of a
        spare part, and why Dashain staffing means everything is booked three weeks
        early because we live it too.
      </p>

      <h2>Our numbers (as of mid-2026)</h2>
      <ul>
        <li><strong>2,400+</strong> verified professionals across 12 categories</li>
        <li><strong>38,000+</strong> jobs completed with a 4.8/5 average rating</li>
        <li><strong>7 cities</strong> live — KTM, Lalitpur, Bhaktapur, Pokhara, Chitwan, Butwal &amp; Biratnagar</li>
        <li><strong>90-day</strong> workmanship guarantee on every booking</li>
      </ul>

      <h2>Work with us</h2>
      <p>
        Building this market takes unusual people: operators who&apos;ve knocked on ward
        offices at 7am, engineers who&apos;ve debugged wiring in a Kathmandu monsoon, and
        product designers who speak Nepali as a first language. If that sounds like you,
        see our open roles on the <a href="/careers">careers page</a>.
      </p>
    </InfoPageShell>
  );
}
