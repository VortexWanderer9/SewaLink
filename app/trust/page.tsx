import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";
import { VerifiedStamp } from "@/components/VerifiedStamp";

export const metadata: Metadata = {
  title: "Trust & Safety — SewaLink Nepal",
  description:
    "How SewaLink verifies workers, protects your payments, and keeps your home safe — the full, honest explanation of our trust and safety systems.",
  alternates: { canonical: "/trust" },
};

export default function Trust() {
  return (
    <InfoPageShell
      title="Trust & safety"
      subtitle="Why thousands of Nepali households have let SewaLink pros through their front door — and why you can too."
    >
      <div className="flex items-center gap-6 my-6 rounded-xl2 border border-sage-600/20 bg-sage-100/40 p-6">
        <div className="text-sage-600 shrink-0" aria-hidden="true">
          <VerifiedStamp size={96} label="VERIFIED" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-ink-900">
            Four checks before a single job is accepted
          </h3>
          <p className="mt-1 text-sm text-ink-700">
            No professional can accept a booking on SewaLink until every item below has been signed off by a member of our in-house verification team.
          </p>
        </div>
      </div>

      <h2>1. ID & Citizenship check</h2>
      <p>
        Every applicant submits their Citizenship Certificate or Passport, and a
        live selfie matching the ID. Cross-checked against official document
        formats and our internal fraud list.
      </p>

      <h2>2. Ward-level recommendation letter</h2>
      <p>
        A signed and stamped letter from the applicant&apos;s local ward office or
        community leader confirming they live at the stated address and are known
        in the community. We follow up with ward contacts by phone for a
        percentage of applications.
      </p>

      <h2>3. Trade certificate or demonstrated skill</h2>
      <p>
        CTEVT certificates, apprenticeship records, Gulf/Malaysia employment
        records, or a practical skill assessment with a senior SewaLink verifier
        — at least one is required. Gulf/Malaysia returnees qualify for fast-track
        onboarding because we see consistently higher workmanship in this group.
      </p>

      <h2>4. Two personal references + in-person spot check</h2>
      <p>
        Two references from past employers or clients, then a surprise in-person
        visit from our verification staff. 1 in 8 applications are rejected at
        this final stage.
      </p>

      <h2>Payment protection</h2>
      <ul>
        <li>Digital payments are held in escrow until you mark the job complete — or for 48 hours, whichever is sooner.</li>
        <li>Cash payments are recorded by the pro in-app with a photo of the completed job.</li>
        <li>Every booking — paid or cash — carries the same 90-day workmanship guarantee.</li>
      </ul>

      <h2>Number sharing is banned.</h2>
      <p>
        Every call and chat goes through the SewaLink app. Your personal number
        is never shared with a worker, and vice-versa. This prevents off-platform
        negotiation, harassment, and the #1 source of disputes on other
        marketplaces.
      </p>
    </InfoPageShell>
  );
}
