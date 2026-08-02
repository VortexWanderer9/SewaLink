"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/browse", label: "Browse services" },
  { href: "/#worker", label: "Become a pro" },
  { href: "/#business", label: "For business" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/5 bg-paper-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-indigo-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900 text-paper-50 text-sm font-bold">
            स
          </span>
          SewaLink
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-700 transition hover:text-indigo-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="text-sm font-medium text-ink-700 transition hover:text-indigo-900">Log in</button>
          <Link
            href="/browse"
            className="rounded-full bg-indigo-900 px-4 py-2 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700"
          >
            Book a service
          </Link>
        </div>

        <button aria-label="Toggle menu" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-900/5 bg-paper-50 px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link
              href="/browse"
              className="rounded-full bg-indigo-900 px-4 py-2 text-center text-sm font-semibold text-paper-50"
              onClick={() => setOpen(false)}
            >
              Book a service
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
