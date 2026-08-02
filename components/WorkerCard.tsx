import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import RatingStars from "./RatingStars";
import type { Worker } from "@/lib/data";

export default function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Link
      href={`/worker/${worker.id}`}
      className="group flex flex-col rounded-xl2 border border-ink-900/8 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-900/20 hover:shadow-[0_8px_30px_-12px_rgba(35,49,90,0.25)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-display text-sm font-bold text-indigo-900" style={{ backgroundColor: "#EAEDF6" }}>
          {worker.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-base font-semibold text-ink-900">{worker.name}</h3>
            {worker.verified && <ShieldCheck size={15} className="shrink-0 text-sage-600" />}
          </div>
          <p className="flex items-center gap-1 text-xs text-ink-400">
            <MapPin size={12} /> {worker.location}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink-700">{worker.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {worker.badges.map((b) => (
          <span key={b} className="rounded-full bg-marigold-100 px-2 py-0.5 text-[11px] font-medium text-marigold-600">
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-900/8 pt-3">
        <div className="flex items-center gap-3">
          <RatingStars rating={worker.rating} />
          <span className="text-xs text-ink-400">{worker.jobsDone} jobs</span>
        </div>
        <span className="font-mono text-sm font-semibold text-indigo-900">from Rs {worker.priceFrom}</span>
      </div>
    </Link>
  );
}
