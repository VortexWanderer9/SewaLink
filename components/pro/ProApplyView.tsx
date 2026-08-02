"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import InfoPageShell from "@/components/InfoPageShell";

const BENEFITS = [
  "Verified badge increases your booking rate 2–3×",
  "Payouts weekly — Tuesday direct bank deposit",
  "Free in-app insurance on every job",
  "Discounts on tools, spare parts & training",
  "Customer contact never shared — no off-platform harassment",
  "Refer a friend bonus: Rs 1,500 after their 5th completed job",
];

export default function ProApplyView() {
  return (
    <InfoPageShell
      title="Apply as a pro"
      subtitle="Join 2,400+ skilled workers getting 4–5 bookings a week through SewaLink. Free to apply. Takes ~8 minutes."
      backHref="/#worker"
      backLabel="Back to worker section"
    >
      <h2>Who we&apos;re looking for</h2>
      <ul>
        <li>Experienced tradespeople with 2+ years of full-time work in your category.</li>
        <li>Clean criminal record, a real ward or community reference.</li>
        <li>Own a smartphone (Android 9+ or iOS 14+) and can use WhatsApp / Signal for onboarding.</li>
        <li>Own or willing to buy the basic tools of your trade.</li>
      </ul>

      <h2>What you get</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <div key={b} className="flex items-start gap-2 rounded-xl2 border border-ink-900/8 bg-white p-3">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sage-600" aria-hidden="true" />
            <span className="text-xs text-ink-700">{b}</span>
          </div>
        ))}
      </div>

      <h2>The 4-step onboarding process</h2>
      <ol>
        <li><strong>Apply online (8 min)</strong> — fill the form, upload photos of your documents.</li>
        <li><strong>Phone interview (15 min)</strong> — we verify your experience and documents.</li>
        <li><strong>In-person skill & ID check (1 hour)</strong> — at our office or a ward office near you.</li>
        <li><strong>Badge issued & first booking</strong> — usually within 3 business days of a successful check.</li>
      </ol>

      <h2>Ready to apply?</h2>
      <p>
        Apply using the form below, or call our pro onboarding team at{" "}
        <a href="tel:+9779800000000" className="font-medium text-indigo-900">
          +977-98-0000-0000
        </a>{" "}
        anytime between 9am–6pm, 7 days a week.
      </p>

      <ApplyForm />

      <p className="text-xs text-ink-400">
        Already applied? Check your status at{" "}
        <Link href="/pro/support" className="font-medium text-indigo-900">
          pro support →
        </Link>
      </p>
    </InfoPageShell>
  );
}

function ApplyForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Electrician");
  const [experience, setExperience] = useState("");

  return (
    <div className="my-6 rounded-xl2 border border-indigo-900/15 bg-indigo-950 p-6 text-paper-50">
      <h3 className="font-display text-base font-semibold">Short-form application</h3>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label className="sm:col-span-2 text-xs font-medium">
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-paper-100/15 bg-indigo-900/50 px-3 py-2 text-sm outline-none focus:border-marigold-400"
            placeholder="Ram Bahadur Thapa"
          />
        </label>
        <label className="text-xs font-medium">
          Phone
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, ""))}
            className="mt-1 w-full rounded-lg border border-paper-100/15 bg-indigo-900/50 px-3 py-2 text-sm outline-none focus:border-marigold-400"
            placeholder="98XXXXXXXX"
          />
        </label>
        <label className="text-xs font-medium">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-paper-100/15 bg-indigo-900/50 px-3 py-2 text-sm outline-none focus:border-marigold-400"
          >
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Carpenter</option>
            <option>Painter</option>
            <option>AC Technician</option>
            <option>CCTV Installer</option>
            <option>Mechanic</option>
            <option>Tutor</option>
            <option>Cleaner</option>
            <option>Mover</option>
            <option>Photographer</option>
            <option>Pest Control</option>
          </select>
        </label>
        <label className="sm:col-span-2 text-xs font-medium">
          Years of experience
          <input
            required
            type="number"
            min={1}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="mt-1 w-full rounded-lg border border-paper-100/15 bg-indigo-900/50 px-3 py-2 text-sm outline-none focus:border-marigold-400"
            placeholder="5"
          />
        </label>
        <div className="sm:col-span-2 mt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-marigold-500 px-6 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-marigold-400"
          >
            Submit application <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
