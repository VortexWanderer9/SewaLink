import WorkerCard from "@/components/WorkerCard";
import type { Worker } from "@/lib/data";

export default function FeaturedPros({ featured }: { featured: Worker[] }) {
  return (
    <section className="container-page py-20" aria-labelledby="pros-heading">
      <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">Meet the network</span>
      <h2 id="pros-heading" className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        Top-rated pros this week
      </h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((w) => (
          <WorkerCard key={w.id} worker={w} />
        ))}
      </div>
    </section>
  );
}
