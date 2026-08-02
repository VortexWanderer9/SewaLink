import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VerifiedStamp } from "@/components/VerifiedStamp";

export default function WorkerCTA() {
  return (
    <section id="worker" className="container-page py-20" aria-labelledby="worker-heading">
      <div className="relative overflow-hidden rounded-[2rem] bg-marigold-500 px-8 py-16 text-indigo-950 sm:px-16">
        <div className="absolute -bottom-16 -right-16 text-indigo-950/10" aria-hidden="true">
          <VerifiedStamp size={260} />
        </div>
        <div className="relative max-w-lg">
          <h2 id="worker-heading" className="font-display text-2xl font-bold sm:text-3xl">
            Skilled with your hands? Get steady work, not just word of mouth.
          </h2>
          <p className="mt-4 text-sm text-indigo-950/80">
            Join 2,400+ verified professionals earning through SewaLink. Returned from
            work abroad with a trade skill? Fast-track verification for Gulf and
            Malaysia-trained tradespeople.
          </p>
          <Link
            href="/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-950 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-900"
          >
            Apply as a pro <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
