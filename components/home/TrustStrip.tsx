import { ShieldCheck, MapPinned, Wallet, MessageCircle } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "ID & background verified" },
  { icon: MapPinned, label: "Live technician tracking" },
  { icon: Wallet, label: "eSewa, Khalti, IME Pay or cash" },
  { icon: MessageCircle, label: "In-app chat, no number sharing" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-ink-900/8 bg-paper-100">
      <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={18} className="shrink-0 text-indigo-900" aria-hidden="true" />
            <span className="text-xs font-medium text-ink-700 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
