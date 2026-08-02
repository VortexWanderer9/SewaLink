import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-paper-100 py-20" aria-labelledby="test-heading">
      <div className="container-page">
        <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">Word on the street</span>
        <h2 id="test-heading" className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          What people are saying
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
              <blockquote>
                <p className="text-sm leading-relaxed text-ink-700">&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-4 text-xs font-medium text-ink-900">
                {t.name} <span className="font-normal text-ink-400">— {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
