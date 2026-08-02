import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Clock, ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RatingStars from "@/components/RatingStars";
import { VerifiedStamp } from "@/components/VerifiedStamp";
import { workers, categories } from "@/lib/data";

export function generateStaticParams() {
  return workers.map((w) => ({ id: w.id }));
}

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const worker = workers.find((w) => w.id === params.id);
  if (!worker) notFound();
  const category = categories.find((c) => c.slug === worker.category);

  const reviews = [
    { name: "Anita G.", rating: 5, text: "Arrived on time and explained exactly what was wrong before starting. Fair price too." },
    { name: "Sagar P.", rating: 5, text: "Fixed a wiring fault two other electricians couldn't figure out. Highly recommend." },
    { name: "Meena T.", rating: 4, text: "Good work, took a little longer than the estimate but kept me updated the whole time." },
  ];

  return (
    <div>
      <Header />
      <section className="bg-indigo-950 py-12 text-paper-50">
        <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-marigold-500 font-display text-xl font-bold text-indigo-950">
              {worker.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{worker.name}</h1>
                {worker.verified && <ShieldCheck size={18} className="text-sage-500" />}
              </div>
              <p className="flex items-center gap-1 text-sm text-paper-100/70">
                <MapPin size={13} /> {worker.location} · {category?.name}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-paper-100/70">
                <RatingStars rating={worker.rating} />
                <span>{worker.jobsDone} jobs completed</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {worker.responseTime}</span>
              </div>
            </div>
          </div>
          <div className="text-marigold-400">
            <VerifiedStamp size={72} />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr,340px]">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{worker.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {worker.badges.map((b) => (
                <span key={b} className="rounded-full bg-marigold-100 px-3 py-1 text-xs font-medium text-marigold-600">
                  {b}
                </span>
              ))}
              {worker.gulfReturnee && (
                <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-600">
                  Foreign-employment certified
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900">Verification</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["ID / Citizenship verified", "Skill certificate reviewed", "Ward recommendation on file", "Background check passed"].map(
                (v) => (
                  <div key={v} className="flex items-center gap-2 rounded-xl border border-ink-900/8 bg-white p-3 text-xs font-medium text-ink-700">
                    <ShieldCheck size={14} className="shrink-0 text-sage-600" /> {v}
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Reviews</h2>
              <RatingStars rating={worker.rating} size={16} />
            </div>
            <div className="mt-3 space-y-3">
              {reviews.map((r) => (
                <div key={r.name} className="rounded-xl2 border border-ink-900/8 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-900">{r.name}</span>
                    <span className="flex items-center gap-1 text-xs text-ink-400">
                      <Star size={12} className="fill-marigold-500 text-marigold-500" /> {r.rating}.0
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-700">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-xl2 border border-ink-900/8 bg-white p-6 lg:sticky lg:top-24">
          <p className="text-xs text-ink-400">Estimated starting price</p>
          <p className="font-display text-2xl font-bold text-indigo-900">Rs {worker.priceFrom}+</p>
          <p className="mt-1 text-xs text-ink-400">Final price confirmed after diagnosis</p>
          <Link
            href={`/booking/${worker.id}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-900 px-6 py-3.5 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            Book {worker.name.split(" ")[0]} <ArrowRight size={16} />
          </Link>
          <Link
            href="#"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-indigo-900/40"
          >
            Message before booking
          </Link>
        </aside>
      </section>
      <Footer />
    </div>
  );
}
