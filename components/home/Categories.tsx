import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/data";

export default function Categories() {
  return (
    <section className="container-page py-20" aria-labelledby="categories-heading">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-marigold-600">What do you need?</span>
          <h2 id="categories-heading" className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Browse by service
          </h2>
        </div>
        <Link
          href="/browse"
          className="hidden text-sm font-semibold text-indigo-900 sm:inline-flex items-center gap-1"
        >
          See all <ArrowRight size={14} aria-hidden="true" />
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
