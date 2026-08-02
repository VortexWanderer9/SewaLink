import type { Worker } from "@/lib/data";

export default function BookingSidebar({ worker }: { worker: Worker }) {
  return (
    <aside className="h-fit rounded-xl2 border border-ink-900/8 bg-paper-100 p-6" aria-label="Booking summary">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900 font-display text-xs font-bold text-paper-50"
          aria-hidden="true"
        >
          {worker.avatarInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900">{worker.name}</p>
          <p className="text-xs text-ink-400">{worker.location}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5 text-xs text-ink-700" aria-label="Booking guarantees">
        <li>• 90-day workmanship guarantee included</li>
        <li>• Free cancellation up to 1 hour before arrival</li>
      </ul>
    </aside>
  );
}
