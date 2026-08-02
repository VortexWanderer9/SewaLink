import type { Metadata } from "next";
import InfoPageShell from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Blog — SewaLink Nepal",
  description:
    "Stories from the field: home maintenance tips for Nepali households, worker spotlights, and the team building SewaLink.",
  alternates: { canonical: "/blog" },
};

const POSTS = [
  {
    title: "Monsoon wiring: the 5 fault types we fix 800+ times every July",
    excerpt: "Why switchboard water ingress, loose neutral connections and exposed outdoor junctions spike during the rains, and how to spot them before they spark.",
    date: "2026-07-12",
    category: "Home tips",
    minutes: 6,
  },
  {
    title: "Why Gulf-returnee workers are changing our verification standards",
    excerpt: "Our first 400 Gulf-trained applicants had better tooling, punctuality and on-the-job safety records than domestic-only candidates. Here's what we changed.",
    date: "2026-06-28",
    category: "Inside SewaLink",
    minutes: 8,
  },
  {
    title: "AC gas refill in Nepal: what Rs 1,500 actually pays for",
    excerpt: "The difference between R-22, R-410A and R-32, why 'top-up' refills usually fail, and what a proper service should include.",
    date: "2026-05-20",
    category: "Home tips",
    minutes: 5,
  },
];

export default function Blog() {
  return (
    <InfoPageShell
      title="The SewaLink blog"
      subtitle="Household tips, worker stories, and honest notes from the team building Nepal's services marketplace."
    >
      <h2>Latest posts</h2>
      {POSTS.map((p) => (
        <article key={p.title} className="my-6 rounded-xl2 border border-ink-900/8 bg-white p-6 transition hover:border-marigold-500/40">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-ink-400">
            <span className="rounded-full bg-marigold-100 px-2.5 py-0.5 font-medium text-marigold-600">
              {p.category}
            </span>
            <time dateTime={p.date}>
              {new Date(p.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>{p.minutes} min read</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
            {p.title}
          </h3>
          <p className="mt-2 text-sm text-ink-700">{p.excerpt}</p>
          <p className="mt-4 text-xs font-medium text-indigo-900">Read article →</p>
        </article>
      ))}
    </InfoPageShell>
  );
}
