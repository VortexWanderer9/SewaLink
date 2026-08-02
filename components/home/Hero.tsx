import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { VerifiedStamp } from "@/components/VerifiedStamp";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-indigo-950 text-paper-50">
      <div className="pointer-events-none absolute inset-0 bg-grain" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-700/40 blur-3xl" />
      <div className="container-page relative grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-marigold-500/30 bg-marigold-500/10 px-3 py-1 text-xs font-medium text-marigold-400">
            Now live across Kathmandu Valley
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Trusted local help,
            <br />
            verified before they
            <br />
            <span className="text-marigold-400">knock on your door.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-paper-100/75">
            Book electricians, plumbers, carpenters, tutors and more from Nepal&apos;s
            first background-checked service marketplace. See their badge. Track their
            arrival. Pay however you like.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-marigold-500 px-6 py-3.5 text-sm font-semibold text-indigo-950 transition hover:bg-marigold-400"
            >
              Book a service <ArrowRight size={16} />
            </Link>
            <Link
              href="/#worker"
              className="inline-flex items-center gap-2 rounded-full border border-paper-100/25 px-6 py-3.5 text-sm font-semibold text-paper-50 transition hover:border-paper-100/50"
            >
              Earn as a pro
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-paper-100/60">
            <span><strong className="font-mono text-paper-50">2,400+</strong> verified pros</span>
            <span className="h-1 w-1 rounded-full bg-paper-100/30" />
            <span><strong className="font-mono text-paper-50">38,000+</strong> jobs completed</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -left-6 -top-6 z-20 text-marigold-400/90 sm:-left-10">
            <VerifiedStamp size={92} />
          </div>
          <div className="rounded-[2rem] border border-paper-100/15 bg-indigo-900/60 p-2 shadow-2xl backdrop-blur">
            <div className="rounded-[1.6rem] bg-paper-50 p-4 text-ink-900">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Booking confirmed</span>
                <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-600">EN ROUTE</span>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl2 bg-paper-100 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-900 font-display text-sm font-bold text-paper-50">
                  BS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Bishnu Shrestha</p>
                  <p className="text-xs text-ink-400">Electrician · Jawalakhel</p>
                </div>
                <ShieldCheck size={18} className="text-sage-600" />
              </div>
              <HeroMap />
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-ink-400">Arriving in</span>
                <span className="font-mono font-semibold text-indigo-900">14 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMap() {
  return (
    <div className="mt-3 h-28 w-full overflow-hidden rounded-xl2 bg-indigo-100 relative" style={{
      backgroundImage: "radial-gradient(circle at 30% 30%, #DCE3F4, transparent 60%), radial-gradient(circle at 70% 70%, #F2E4C8, transparent 55%)"
    }}>
      <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden="true">
        <path d="M10 80 Q60 20 110 60 T190 30" stroke="#34467D" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.5" />
        <circle cx="10" cy="80" r="5" fill="#5F8C64" />
        <circle cx="190" cy="30" r="6" fill="#E8A33D" />
      </svg>
    </div>
  );
}
