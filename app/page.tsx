import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPinned, Wallet, MessageCircle, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import WorkerCard from "@/components/WorkerCard";
import { VerifiedStamp } from "@/components/VerifiedStamp";
import { categories, workers, testimonials } from "@/lib/data";

export default function Home() {
  const featuredWorkers = workers.slice(0, 3);

  return (
    <div>
      <Header />
      <Hero />
      <TrustStrip />
      <Categories />
      <HowItWorks />
      <FeaturedPros featured={featuredWorkers} />
      <BusinessSection />
      <WorkerCTA />
      <Testimonials />
      <FAQ />
      <DownloadApp />
      <InvestorSection />
      <Footer />
    </div>
  );
}

function Hero() {
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
              <div className="mt-3 h-28 w-full overflow-hidden rounded-xl2 bg-[radial-gradient(circle_at_30%_30%,#DCE3F4,transparent_60%),radial-gradient(circle_at_70%_70%,#F2E4C8,transparent_55%)] bg-indigo-100 relative">
                <svg viewBox="0 0 200 100" className="h-full w-full">
                  <path d="M10 80 Q60 20 110 60 T190 30" stroke="#34467D" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.5" />
                  <circle cx="10" cy="80" r="5" fill="#5F8C64" />
                  <circle cx="190" cy="30" r="6" fill="#E8A33D" />
                </svg>
              </div>
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

function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: "ID & background verified" },
    { icon: MapPinned, label: "Live technician tracking" },
    { icon: Wallet, label: "eSewa, Khalti, IME Pay or cash" },
    { icon: MessageCircle, label: "In-app chat, no number sharing" },
  ];
  return (
    <section className="border-b border-ink-900/8 bg-paper-100">
      <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={18} className="shrink-0 text-indigo-900" />
            <span className="text-xs font-medium text-ink-700 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">What do you need?</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">Browse by service</h2>
        </div>
        <Link href="/browse" className="hidden text-sm font-semibold text-indigo-900 sm:inline-flex items-center gap-1">
          See all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Search", desc: "Tell us the job — pick a category or describe it in your own words, Nepali or English." },
    { title: "Book", desc: "Compare verified pros nearby with real ratings and upfront price ranges. Book now or schedule ahead." },
    { title: "Relax", desc: "Track their arrival live, chat in-app, and pay however suits you — digital wallet or cash." },
  ];
  return (
    <section className="bg-indigo-900 py-20 text-paper-50">
      <div className="container-page">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Three steps. No phone tag.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-xl2 border border-paper-100/10 bg-indigo-950/40 p-6">
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

function FeaturedPros({ featured }: { featured: typeof workers }) {
  return (
    <section className="container-page py-20">
      <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">Meet the network</span>
      <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">Top-rated pros this week</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((w) => (
          <WorkerCard key={w.id} worker={w} />
        ))}
      </div>
    </section>
  );
}

function BusinessSection() {
  return (
    <section id="business" className="bg-paper-100 py-20">
      <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brick-500">For businesses</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            One dashboard for every property&apos;s maintenance
          </h2>
          <p className="mt-4 max-w-md text-sm text-ink-700">
            Hotels, offices, and retail chains use SewaLink Business to schedule recurring
            AC servicing, CCTV maintenance, cleaning and pest control across every
            location — with consolidated invoices, not six phone numbers.
          </p>
          <Link
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            Talk to sales <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Basic", "Pay-per-visit, no contract"],
            ["Pro", "Monthly maintenance contracts"],
            ["Enterprise", "Multi-site SLA + priority support"],
            ["Invoicing", "VAT-compliant digital invoices"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl2 border border-ink-900/8 bg-white p-4">
              <h3 className="font-display text-sm font-semibold text-ink-900">{title}</h3>
              <p className="mt-1 text-xs text-ink-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkerCTA() {
  return (
    <section id="worker" className="container-page py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-marigold-500 px-8 py-16 text-indigo-950 sm:px-16">
        <div className="absolute -bottom-16 -right-16 text-indigo-950/10">
          <VerifiedStamp size={260} />
        </div>
        <div className="relative max-w-lg">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Skilled with your hands? Get steady work, not just word of mouth.
          </h2>
          <p className="mt-4 text-sm text-indigo-950/80">
            Join 2,400+ verified professionals earning through SewaLink. Returned from
            work abroad with a trade skill? Fast-track verification for Gulf and
            Malaysia-trained tradespeople.
          </p>
          <Link
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-950 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-900"
          >
            Apply as a pro <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-paper-100 py-20">
      <div className="container-page">
        <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">Word on the street</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">What people are saying</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
              <p className="text-sm leading-relaxed text-ink-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-xs font-medium text-ink-900">
                {t.name} <span className="font-normal text-ink-400">— {t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is it safe to let a stranger into my home?", a: "Every professional on SewaLink passes ID verification, a background check, and skill certification before they can accept jobs. You can see their verification badge, ratings, and past job count before booking." },
    { q: "What payment methods are supported?", a: "eSewa, Khalti, IME Pay, Fonepay, major cards, and cash on completion — you choose at checkout." },
    { q: "How are workers verified?", a: "We check citizenship/ID documents, request a ward recommendation letter, and review trade certificates. Gulf and Malaysia-trained tradespeople can fast-track using their foreign employment records." },
    { q: "What if I'm not satisfied with the service?", a: "Every booking includes a 90-day workmanship guarantee. Flag an issue in-app and our support team will arrange a free follow-up visit or refund." },
  ];
  return (
    <section className="container-page py-20">
      <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Frequently asked</h2>
      <div className="mt-8 divide-y divide-ink-900/8 rounded-xl2 border border-ink-900/8 bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-ink-900">
              {f.q}
              <ChevronDown size={16} className="shrink-0 text-ink-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function DownloadApp() {
  return (
    <section className="bg-indigo-950 py-20 text-paper-50">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Get the app</h2>
        <p className="max-w-md text-sm text-paper-100/70">
          Available now in Kathmandu, Lalitpur, Bhaktapur, and Pokhara. More cities coming soon.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="rounded-xl border border-paper-100/20 px-5 py-3 text-sm font-medium">App Store →</div>
          <div className="rounded-xl border border-paper-100/20 px-5 py-3 text-sm font-medium">Google Play →</div>
        </div>
      </div>
    </section>
  );
}

function InvestorSection() {
  return (
    <section className="container-page py-20">
      <div className="rounded-[2rem] border border-ink-900/8 bg-white p-10 sm:p-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brick-500">For investors</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              Building the trust layer for Nepal&apos;s services economy
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink-700">
              SewaLink is assembling the verification, dispatch, and payments
              infrastructure a market this size has never had. Get our deck and
              latest traction numbers.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="#" className="rounded-full bg-indigo-900 px-6 py-3 text-center text-sm font-semibold text-paper-50 transition hover:bg-indigo-700">
              Download pitch deck
            </Link>
            <Link href="#" className="rounded-full border border-ink-900/15 px-6 py-3 text-center text-sm font-semibold text-ink-900 transition hover:border-indigo-900/40">
              Contact founders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
