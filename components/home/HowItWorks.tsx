const steps = [
  { title: "Search", desc: "Tell us the job — pick a category or describe it in your own words, Nepali or English." },
  { title: "Book", desc: "Compare verified pros nearby with real ratings and upfront price ranges. Book now or schedule ahead." },
  { title: "Relax", desc: "Track their arrival live, chat in-app, and pay however suits you — digital wallet or cash." },
];

export default function HowItWorks() {
  return (
    <section className="bg-indigo-900 py-20 text-paper-50" aria-labelledby="how-heading">
      <div className="container-page">
        <h2 id="how-heading" className="font-display text-2xl font-bold sm:text-3xl">
          Three steps. No phone tag.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3" role="list">
          {steps.map((s, i) => (
            <div
              key={s.title}
              role="listitem"
              className="relative rounded-xl2 border border-paper-100/10 bg-indigo-950/40 p-6"
            >
              <span className="font-mono text-xs text-marigold-400">Step {i + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-paper-100/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
