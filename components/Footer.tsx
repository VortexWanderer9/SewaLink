import Link from "next/link";

type FooterLink = { label: string; href: string };

const COMPANY: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Press", href: "/press" },
];

const PROS: FooterLink[] = [
  { label: "Become a pro", href: "/pro/apply" },
  { label: "Verification process", href: "/pro/verification" },
  { label: "Earnings & payouts", href: "/pro/earnings" },
  { label: "Pro support", href: "/pro/support" },
];

const SUPPORT: FooterLink[] = [
  { label: "Help center", href: "/help" },
  { label: "Trust & safety", href: "/trust" },
  { label: "Terms of service", href: "/terms" },
  { label: "Privacy policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper-200 bg-indigo-950 text-paper-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold" aria-label="SewaLink Nepal — Home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marigold-500 text-indigo-950 text-sm font-bold" aria-hidden="true">
              स
            </span>
            SewaLink
          </Link>
          <p className="mt-3 max-w-xs text-sm text-paper-100/70">
            भरपर्दो सेवा, एक ट्याप टाढा — Trusted service, one tap away.
          </p>
          <address className="mt-5 not-italic text-xs text-paper-100/60">
            <p>Kathmandu, Nepal</p>
            <p className="mt-1">
              <a href="tel:+97715555555" className="hover:text-marigold-400 transition">+977-1-5555555</a>
            </p>
            <p className="mt-1">
              <a href="mailto:support@sewalinknepal.com" className="hover:text-marigold-400 transition">support@sewalinknepal.com</a>
            </p>
          </address>
        </div>

        <FooterCol title="Company" items={COMPANY} />
        <FooterCol title="For professionals" items={PROS} />
        <FooterCol title="Support" items={SUPPORT} />
      </div>
      <div className="container-page flex flex-col items-start justify-between gap-3 border-t border-paper-100/10 py-6 text-xs text-paper-100/60 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} SewaLink Nepal Pvt. Ltd. Serving Kathmandu Valley &amp; Pokhara.</span>
        <span>Made in Nepal 🇳🇵</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-paper-100">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-sm text-paper-100/70 transition hover:text-marigold-400">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
