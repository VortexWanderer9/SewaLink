import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function InfoPageShell({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back home",
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Header />
      <section className="border-b border-ink-900/8 bg-indigo-950 py-16 text-paper-50">
        <div className="container-page">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-paper-100/70 transition hover:text-marigold-400"
          >
            <ArrowLeft size={13} aria-hidden="true" /> {backLabel}
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-xl text-sm text-paper-100/70">{subtitle}</p>}
        </div>
      </section>
      <section className="container-page py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr,280px] lg:gap-16">
          <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-p:text-ink-700 prose-a:text-indigo-900 prose-strong:text-ink-900 prose-h2:mt-10 prose-h3:mt-6">
            {children}
          </article>
          <aside className="space-y-6">
            <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
              <h3 className="font-display text-sm font-semibold text-ink-900">Need help?</h3>
              <ul className="mt-3 space-y-2 text-xs text-ink-700">
                <li>
                  📞 <a href="tel:+97715555555" className="font-medium hover:text-indigo-900">+977-1-5555555</a>
                </li>
                <li>
                  ✉️ <a href="mailto:support@sewalinknepal.com" className="font-medium hover:text-indigo-900">support@sewalinknepal.com</a>
                </li>
                <li>🕐 7 days · 7am to 10pm NPT</li>
              </ul>
            </div>
            <Link
              href="/browse"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
            >
              Browse verified pros
            </Link>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
