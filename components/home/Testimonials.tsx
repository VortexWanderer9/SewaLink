export default function Testimonials() {
  return (
    <section className="bg-paper-100 py-20" aria-labelledby="test-heading">
      <div className="container-page">
        <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">Word on the street</span>
        <h2 id="test-heading" className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          What people are saying
        </h2>
        <div className="mt-8 rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
          <p className="font-display text-sm font-semibold text-ink-900">Testimonials coming soon</p>
          <p className="mt-1 text-xs text-ink-400">We'll be showcasing real customer experiences here.</p>
        </div>
      </div>
    </section>
  );
}
