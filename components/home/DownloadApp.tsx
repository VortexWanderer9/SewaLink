import Link from "next/link";
import { Smartphone } from "lucide-react";

const stores = [
  { label: "App Store", href: "#", desc: "iOS 15+", icon: "🍎" },
  { label: "Google Play", href: "#", desc: "Android 9+", icon: "🤖" },
];

export default function DownloadApp() {
  return (
    <section className="bg-indigo-950 py-20 text-paper-50" aria-labelledby="app-heading">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-marigold-500/10 p-3 text-marigold-400" aria-hidden="true">
          <Smartphone size={22} />
        </div>
        <h2 id="app-heading" className="font-display text-2xl font-bold sm:text-3xl">
          Get the app
        </h2>
        <p className="max-w-md text-sm text-paper-100/70">
          Available now in Kathmandu, Lalitpur, Bhaktapur, and Pokhara. More cities coming soon.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {stores.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group flex items-center gap-3 rounded-xl border border-paper-100/20 px-5 py-3 text-left transition hover:border-marigold-400/60 hover:bg-paper-100/5"
              aria-label={`Download on ${s.label} (${s.desc})`}
            >
              <span aria-hidden="true" className="text-xl">{s.icon}</span>
              <div>
                <p className="text-xs text-paper-100/60">Download on the</p>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-[10px] text-paper-100/40">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
