import Link from "next/link";
import { Home, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div>
      <Header />
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-marigold-600">
          404 · Page missing
        </p>
        <h1 className="font-display text-4xl font-bold text-ink-900 sm:text-5xl">
          This page wandered off somewhere.
        </h1>
        <p className="max-w-md text-sm text-ink-700">
          The link might be old, or a service pro accidentally knocked it off the
          switchboard. Try searching or head back home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            <Home size={16} /> Back home
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-indigo-900/40"
          >
            <Search size={16} /> Browse services
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
