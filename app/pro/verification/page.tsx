import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Worker verification process — SewaLink Nepal",
  description: "Exactly how we verify workers: the four checks, pass rates, document requirements and the Gulf/Malaysia fast-track pathway.",
  alternates: { canonical: "/pro/verification" },
};

export default function ProVerification() {
  return (
    <InfoPageShell
      title="The verification process"
      subtitle="What we check, what you need to upload, and how to get your verified badge in 3 business days or less."
      backHref="/pro/apply"
      backLabel="Go to apply"
    >
      <h2>Pass rates by stage</h2>
      <p>
        Out of every 100 applications we receive:
      </p>
      <ul>
        <li><strong>72</strong> pass stage 1 (document review)</li>
        <li><strong>58</strong> pass stage 2 (phone interview)</li>
        <li><strong>48</strong> pass stage 3 (in-person check)</li>
        <li><strong>46</strong> are onboarded and given their first job in week 1.</li>
      </ul>

      <h2>Stage 1 — Documents</h2>
      <ul>
        <li>Citizenship certificate (both sides, colour, in-focus).</li>
        <li>Passport-size selfie (no face coverings, no sunglasses).</li>
        <li>Ward-level recommendation letter or community reference <em>with phone number</em>.</li>
        <li>Any trade / CTEVT / Gulf work documents (optional but <em>strongly</em> recommended).</li>
      </ul>

      <h2>Stage 2 — Phone interview (10–20 min)</h2>
      <p>
        We call the number on your application and ask:
      </p>
      <ul>
        <li>Basic category knowledge (e.g. an electrician will be asked the safe amp rating of a 1.5mm² wire in a Nepali domestic installation).</li>
        <li>3 typical pricing questions.</li>
        <li>Two behavioural questions about handling difficult customers or disputed jobs.</li>
      </ul>

      <h2>Stage 3 — In-person or ward spot-check</h2>
      <p>
        A member of our verification staff meets you (at our office, a ward
        office, or your home) to confirm your identity, check a couple of your
        tools, and call your ward reference on speakerphone.
      </p>

      <h2>Stage 4 — Fast-track for Gulf &amp; Malaysia returnees</h2>
      <p>
        If you have 2+ years of documented overseas work in your trade, you skip
        stage 2 (phone technical quiz) and stage 3 is streamlined to a 20-minute
        document verification at our office. The pass rate in this group is 78%.
      </p>

      <h2>After you pass</h2>
      <ul>
        <li>Your badge is issued and your profile goes live that night.</li>
        <li>We artificially limit your first 10 jobs to small, easy bookings so customers get to know you.</li>
        <li>After 10 completed jobs at 4.5+ stars — you join full circulation with priority booking.</li>
      </ul>
    </InfoPageShell>
  );
}
