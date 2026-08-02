import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-paper-200 bg-indigo-950 text-paper-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marigold-500 text-indigo-950 text-sm font-bold">
              स
            </span>
            SewaLink
          </div>
          <p className="mt-3 max-w-xs text-sm text-paper-100/70">
            भरपर्दो सेवा, एक ट्याप टाढा — Trusted service, one tap away.
          </p>
        </div>

        <FooterCol title="Company" items={["About", "Careers", "Blog", "Press"]} />
        <FooterCol title="For professionals" items={["Become a pro", "Verification process", "Earnings & payouts", "Pro support"]} />
        <FooterCol title="Support" items={["Help center", "Trust & safety", "Terms of service", "Privacy policy"]} />
      </div>
      <div className="container-page flex flex-col items-start justify-between gap-3 border-t border-paper-100/10 py-6 text-xs text-paper-100/60 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} SewaLink Nepal. Serving Kathmandu Valley &amp; Pokhara.</span>
        <span>Made in Nepal 🇳🇵</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-paper-100">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i}>
            <Link href="#" className="text-sm text-paper-100/70 transition hover:text-marigold-400">
              {i}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
