import Link from "next/link";
import {
  Zap,
  Wrench,
  Hammer,
  PaintBucket,
  Snowflake,
  Video,
  Car,
  BookOpen,
  Sparkles,
  Truck,
  Camera,
  Bug,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/data";

export const categoryIcons: Record<string, LucideIcon> = {
  electrician: Zap,
  plumber: Wrench,
  carpenter: Hammer,
  painter: PaintBucket,
  "ac-technician": Snowflake,
  cctv: Video,
  mechanic: Car,
  tutor: BookOpen,
  cleaner: Sparkles,
  mover: Truck,
  photographer: Camera,
  "pest-control": Bug,
};

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = categoryIcons[category.slug] ?? Wrench;
  return (
    <Link
      href={`/browse?category=${category.slug}`}
      className="group flex flex-col items-start gap-3 rounded-xl2 border border-ink-900/8 bg-white p-5 transition hover:-translate-y-0.5 hover:border-marigold-500/40 hover:shadow-[0_8px_30px_-12px_rgba(232,163,61,0.35)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-900 text-marigold-400 transition group-hover:bg-marigold-500 group-hover:text-indigo-950">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h3 className="font-display text-sm font-semibold text-ink-900">{category.name}</h3>
        <p className="font-devanagari text-xs text-ink-400">{category.nameNe}</p>
      </div>
      <p className="text-xs text-ink-700">{category.blurb}</p>
      <span className="font-mono text-[11px] text-ink-400">{category.avgPrice}</span>
    </Link>
  );
}
