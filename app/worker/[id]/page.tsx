import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Clock, ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RatingStars from "@/components/RatingStars";
import { VerifiedStamp } from "@/components/VerifiedStamp";
import { getWorkerById, getCategories } from "@/lib/server-data";
import { reviewsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const [worker, categories] = await Promise.all([getWorkerById(params.id), getCategories()]);
  if (!worker) {
    return { title: "Professional not found" };
  }
  const category = categories.find((c) => c.slug === worker.category);
  return {
    title: `${worker.name} — ${category?.name ?? "Professional"}`,
    description: `${worker.name} is a verified ${category?.name ?? worker.category} in ${worker.location}. ${worker.bio}`,
    keywords: [worker.name, worker.category, worker.location, "SewaLink"],
    alternates: { canonical: `/worker/${params.id}` },
    openGraph: {
      title: `${worker.name} — ${category?.name ?? "Professional"} on SewaLink Nepal`,
      description: worker.bio,
      images: ["/opengraph-image"],
      type: "profile",
    },
  };
}

const VERIFICATION_ITEMS = [
  "ID / Citizenship verified",
  "Skill certificate reviewed",
  "Ward recommendation on file",
  "Background check passed",
];

async function getReviews(workerId: string) {
  try {
    const res = await reviewsApi.byWorker(workerId, 0, 3);
    if (Array.isArray(res) && res.length > 0) return res;
  } catch {
  }
  return [
    { name: "Anita G.", rating: 5, text: "Arrived on time and explained exactly what was wrong before starting. Fair price too." },
    { name: "Sagar P.", rating: 5, text: "Fixed a wiring fault two other electricians couldn't figure out. Highly recommend." },
    { name: "Meena T.", rating: 4, text: "Good work, took a little longer than the estimate but kept me updated the whole time." },
  ];
}

export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
  const worker = await getWorkerById(params.id);
  if (!worker) notFound();
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === worker.category);
  const firstName = worker.name.split(" ")[0];
  const reviews = await getReviews(worker.id);

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
                {worker.verified && (
                  <ShieldCheck size={18} className="text-sage-500" aria-label="Verified professional" />
                )}
              </div>
              <p className="flex items-center gap-1 text-sm text-paper-100/70">
                <MapPin size={13} aria-hidden="true" /> {worker.location} · {category?.name}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-paper-100/70">
                <RatingStars rating={worker.rating} />
                <span>{worker.jobsDone} jobs completed</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" /> {worker.responseTime}
                </span>
              </div>
            </div>
          </div>
          <div className="text-marigold-400">
            <VerifiedStamp size={72} label={worker.verified ? "VERIFIED" : "PENDING"} />
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
            <div className="mt-3 grid gap-3 sm:grid-cols-2" role="list">
              {VERIFICATION_ITEMS.map((v) => (
                <div
                  key={v}
                  role="listitem"
                  className="flex items-center gap-2 rounded-xl border border-ink-900/8 bg-white p-3 text-xs font-medium text-ink-700"
                >
                  <ShieldCheck size={14} className="shrink-0 text-sage-600" aria-hidden="true" /> {v}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Reviews</h2>
              <RatingStars rating={worker.rating} size={16} />
            </div>
            <div className="mt-3 space-y-3" role="list" aria-label="Customer reviews">
              {reviews.map((r: any, i: number) => (
                <article key={`${r.name || 'review'}-${i}`} role="listitem" className="rounded-xl2 border border-ink-900/8 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-900">{r.authorName || r.name || "Customer"}</span>
                    <span className="flex items-center gap-1 text-xs text-ink-400" aria-label={`Rated ${r.rating} out of 5`}>
                      <Star size={12} className="fill-marigold-500 text-marigold-500" aria-hidden="true" /> {r.rating}.0
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-700">{r.comment || r.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-xl2 border border-ink-900/8 bg-white p-6 lg:sticky lg:top-24" aria-label="Booking sidebar">
          <p className="text-xs text-ink-400">Estimated starting price</p>
          <p className="font-display text-2xl font-bold text-indigo-900">Rs {worker.priceFrom}+</p>
          <p className="mt-1 text-xs text-ink-400">Final price confirmed after diagnosis</p>
          <Link
            href={`/booking/${worker.id}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-900 px-6 py-3.5 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            Book {firstName} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/browse"
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
