"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div>
      <Header />
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="rounded-full bg-brick-100 p-4 text-brick-500">
          <AlertTriangle size={28} />
        </div>
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-brick-500">
          Something went wrong
        </p>
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          There was a problem loading this page.
        </h1>
        <p className="max-w-md text-sm text-ink-700">
          Our team has been notified. You can retry the request or head back to
          the homepage — your data is safe.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-ink-400">
            Ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            <RefreshCw size={16} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-indigo-900/40"
          >
            <Home size={16} /> Back home
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
