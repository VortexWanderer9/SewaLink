import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Press & Media — SewaLink Nepal",
  description:
    "Press resources, brand assets, and media contacts for SewaLink Nepal — the trusted services marketplace serving Kathmandu, Pokhara and beyond.",
  alternates: { canonical: "/press" },
};

export default function Press() {
  return (
    <InfoPageShell
      title="Press & media"
      subtitle="Brand assets, facts, figures and the right people to talk to when you're writing about SewaLink."
    >
      <h2>Brand assets</h2>
      <ul>
        <li>
          <strong>Logo (SVG):</strong>{" "}
          <a href="/icon.svg" className="break-all">
            /icon.svg
          </a>{" "}
          (circular)
        </li>
        <li>
          <strong>Open Graph template:</strong> 1200×630, generated from{" "}
          <code className="rounded bg-paper-100 px-1 py-0.5 font-mono text-xs">/opengraph-image</code>
        </li>
        <li>
          <strong>Colours — primary:</strong> Indigo #23315A, Accent Marigold #E8A33D, Verified Sage #5F8C64
        </li>
      </ul>

      <h2>Fast facts (H1 2026)</h2>
      <ul>
        <li>Founded Kathmandu, 2024. Private, Nepali-founded.</li>
        <li>2,400+ verified workers across 12 service categories.</li>
        <li>38,000+ jobs completed. 4.8/5 average customer rating.</li>
        <li>Active cities: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Butwal, Biratnagar.</li>
        <li>Payments: eSewa, Khalti, IME Pay, Fonepay, cards, cash-on-completion.</li>
      </ul>

      <h2>Selected coverage</h2>
      <ul>
        <li>
          <em>“Can SewaLink fix Nepal's plumber problem?”</em> — Nepal Business Review, April 2026
        </li>
        <li>
          <em>“The marigold-badge startup building a ward-level trust network”</em> — Nepali Tech Weekly, February 2026
        </li>
      </ul>

      <h2>Press enquiries</h2>
      <p>
        Email{" "}
        <a href="mailto:press@sewalinknepal.com" className="font-medium">
          press@sewalinknepal.com
        </a>{" "}
        with your deadline and angle. We respond within 24 hours on working days.
      </p>
    </InfoPageShell>
  );
}
